<?php

namespace Tests\Feature;

use App\Actions\Inventory\AdjustInventory;
use App\Actions\Orders\TransitionOrderStatus;
use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use DomainException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDomainActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_inventory_adjustment_is_audited_and_cannot_cross_reserved_stock(): void
    {
        $admin = User::factory()->admin()->create();
        $variant = ProductVariant::factory()->create();

        app(AdjustInventory::class)->handle($variant, 12, $admin);

        $this->assertDatabaseHas(InventoryItem::class, [
            'product_variant_id' => $variant->id,
            'on_hand' => 12,
            'reserved' => 0,
        ]);
        $this->assertDatabaseHas(InventoryMovement::class, [
            'product_variant_id' => $variant->id,
            'actor_id' => $admin->id,
            'type' => InventoryMovementType::Correction->value,
            'on_hand_delta' => 12,
        ]);

        $variant->inventoryItem()->update(['reserved' => 5]);
        $this->expectException(DomainException::class);
        app(AdjustInventory::class)->handle($variant, 4, $admin);
    }

    public function test_cancelling_pending_order_releases_inventory_and_records_history(): void
    {
        $admin = User::factory()->admin()->create();
        $variant = ProductVariant::factory()->create();
        InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 10,
            'reserved' => 2,
        ]);
        $order = Order::factory()->create();
        InventoryReservation::query()->create([
            'order_id' => $order->id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
            'status' => InventoryReservationStatus::Active,
            'idempotency_key' => hash('sha256', 'admin-cancel-test'),
            'expires_at' => now()->addMinutes(20),
        ]);

        app(TransitionOrderStatus::class)->handle($order, OrderStatus::Cancelled, $admin, 'لغو توسط مدیر');

        $this->assertSame(OrderStatus::Cancelled, $order->fresh()->status);
        $this->assertSame(0, $variant->inventoryItem()->firstOrFail()->reserved);
        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $order->id,
            'actor_id' => $admin->id,
            'from_status' => OrderStatus::PendingPayment->value,
            'to_status' => OrderStatus::Cancelled->value,
        ]);
    }
}
