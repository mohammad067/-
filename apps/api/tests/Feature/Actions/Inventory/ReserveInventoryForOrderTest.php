<?php

namespace Tests\Feature\Actions\Inventory;

use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Exceptions\Domain\InsufficientStock;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReserveInventoryForOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_reserves_available_inventory_once_when_retried(): void
    {
        $variant = ProductVariant::factory()->create();
        $inventoryItem = InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 8,
            'reserved' => 1,
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

        $action = app(ReserveInventoryForOrder::class);

        $action->handle($order);
        $action->handle($order);

        $this->assertSame(4, $inventoryItem->fresh()->reserved);
        $this->assertDatabaseCount(InventoryReservation::class, 1);
        $this->assertDatabaseHas(InventoryReservation::class, [
            'order_id' => $order->id,
            'product_variant_id' => $variant->id,
            'quantity' => 3,
            'status' => InventoryReservationStatus::Active->value,
        ]);
        $this->assertDatabaseCount(InventoryMovement::class, 1);
        $this->assertDatabaseHas(InventoryMovement::class, [
            'product_variant_id' => $variant->id,
            'type' => InventoryMovementType::Reservation->value,
            'reserved_delta' => 3,
            'balance_reserved' => 4,
        ]);
    }

    public function test_it_rolls_back_all_reservations_when_any_variant_is_out_of_stock(): void
    {
        $availableVariant = ProductVariant::factory()->create();
        $unavailableVariant = ProductVariant::factory()->create();
        $availableInventory = InventoryItem::query()->create([
            'product_variant_id' => $availableVariant->id,
            'on_hand' => 10,
            'reserved' => 0,
        ]);
        InventoryItem::query()->create([
            'product_variant_id' => $unavailableVariant->id,
            'on_hand' => 1,
            'reserved' => 0,
        ]);
        $order = Order::factory()->create();

        foreach ([$availableVariant, $unavailableVariant] as $variant) {
            OrderItem::factory()->create([
                'order_id' => $order->id,
                'product_id' => $variant->product_id,
                'product_variant_id' => $variant->id,
                'quantity' => 2,
                'unit_price_rials' => 15_000_000,
                'line_total_rials' => 30_000_000,
            ]);
        }

        try {
            app(ReserveInventoryForOrder::class)->handle($order);
            $this->fail('Expected the order reservation to fail.');
        } catch (InsufficientStock $exception) {
            $this->assertSame($unavailableVariant->public_id, $exception->variantPublicId);
            $this->assertSame(2, $exception->requestedQuantity);
            $this->assertSame(1, $exception->availableQuantity);
        }

        $this->assertSame(0, $availableInventory->fresh()->reserved);
        $this->assertDatabaseCount(InventoryReservation::class, 0);
        $this->assertDatabaseCount(InventoryMovement::class, 0);
    }
}
