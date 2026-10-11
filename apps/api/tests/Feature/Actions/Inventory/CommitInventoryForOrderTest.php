<?php

namespace Tests\Feature\Actions\Inventory;

use App\Actions\Inventory\CommitInventoryForOrder;
use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommitInventoryForOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_commits_a_reservation_once_when_retried(): void
    {
        $variant = ProductVariant::factory()->create();
        $inventoryItem = InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 8,
            'reserved' => 0,
        ]);
        $order = Order::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'quantity' => 3,
            'unit_price_rials' => 15_000_000,
            'line_total_rials' => 45_000_000,
        ]);

        app(ReserveInventoryForOrder::class)->handle($order);

        $action = app(CommitInventoryForOrder::class);
        $action->handle($order);
        $action->handle($order);

        $inventoryItem->refresh();

        $this->assertSame(5, $inventoryItem->on_hand);
        $this->assertSame(0, $inventoryItem->reserved);
        $this->assertDatabaseHas(InventoryReservation::class, [
            'order_id' => $order->id,
            'status' => InventoryReservationStatus::Committed->value,
        ]);
        $this->assertDatabaseCount(InventoryMovement::class, 2);
        $this->assertDatabaseHas(InventoryMovement::class, [
            'product_variant_id' => $variant->id,
            'type' => InventoryMovementType::Sale->value,
            'on_hand_delta' => -3,
            'reserved_delta' => -3,
            'balance_on_hand' => 5,
            'balance_reserved' => 0,
        ]);
    }
}
