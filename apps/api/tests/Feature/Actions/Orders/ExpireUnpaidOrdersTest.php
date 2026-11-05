<?php

namespace Tests\Feature\Actions\Orders;

use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Actions\Orders\ExpireUnpaidOrders;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpireUnpaidOrdersTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_expires_only_eligible_unpaid_orders_and_releases_inventory_once(): void
    {
        $this->travelTo('2026-11-05 12:00:00');

        [$expiredOrder, $expiredInventory] = $this->createReservedOrder(now()->addMinute());
        [$openOrder, $openInventory] = $this->createReservedOrder(now()->addHour());
        [$verifyingOrder, $verifyingInventory] = $this->createReservedOrder(
            now()->addMinute(),
            PaymentStatus::AwaitingVerification,
        );

        $this->travelTo('2026-11-05 12:02:00');

        $affected = app(ExpireUnpaidOrders::class)->handle(chunkSize: 1);

        $this->assertSame(1, $affected);
        $this->assertSame(OrderStatus::Expired, $expiredOrder->fresh()->status);
        $this->assertSame(PaymentStatus::Cancelled, $expiredOrder->fresh()->payment_status);
        $this->assertSame(0, $expiredInventory->fresh()->reserved);
        $this->assertDatabaseHas(InventoryReservation::class, [
            'order_id' => $expiredOrder->id,
            'status' => InventoryReservationStatus::Expired->value,
        ]);
        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $expiredOrder->id,
            'actor_id' => null,
            'from_status' => OrderStatus::PendingPayment->value,
            'to_status' => OrderStatus::Expired->value,
            'reason' => 'payment_window_expired',
        ]);

        $this->assertSame(OrderStatus::PendingPayment, $openOrder->fresh()->status);
        $this->assertSame(2, $openInventory->fresh()->reserved);
        $this->assertSame(OrderStatus::PendingPayment, $verifyingOrder->fresh()->status);
        $this->assertSame(2, $verifyingInventory->fresh()->reserved);

        $movementCount = InventoryMovement::query()->count();
        $this->assertSame(0, app(ExpireUnpaidOrders::class)->handle(chunkSize: 1));
        $this->assertSame($movementCount, InventoryMovement::query()->count());
        $this->assertSame(0, $expiredInventory->fresh()->reserved);
    }

    /** @return array{Order, InventoryItem} */
    private function createReservedOrder(\DateTimeInterface $expiresAt, PaymentStatus $paymentStatus = PaymentStatus::Pending): array
    {
        $variant = ProductVariant::factory()->create();
        $inventory = InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 10,
            'reserved' => 0,
        ]);
        $order = Order::factory()->create([
            'status' => OrderStatus::PendingPayment,
            'payment_status' => $paymentStatus,
            'expires_at' => $expiresAt,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
            'unit_price_rials' => 15_000_000,
            'line_total_rials' => 30_000_000,
        ]);

        app(ReserveInventoryForOrder::class)->handle($order);

        return [$order, $inventory];
    }
}
