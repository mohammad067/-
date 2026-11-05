<?php

namespace Tests\Feature\Actions\Orders;

use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Actions\Orders\TransitionOrderStatus;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\InventoryItem;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use DomainException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransitionOrderStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_paid_transition_requires_verified_payment_and_commits_inventory_once(): void
    {
        [$order, $inventory] = $this->createReservedOrder();

        try {
            app(TransitionOrderStatus::class)->handle($order, OrderStatus::Paid);
            $this->fail('An unverified order must not become paid.');
        } catch (DomainException) {
            $this->assertSame(OrderStatus::PendingPayment, $order->fresh()->status);
            $this->assertSame(2, $inventory->fresh()->reserved);
        }

        $order->update(['payment_status' => PaymentStatus::Paid]);
        $paidOrder = app(TransitionOrderStatus::class)->handle($order, OrderStatus::Paid);

        $this->assertSame(OrderStatus::Paid, $paidOrder->status);
        $this->assertNotNull($paidOrder->paid_at);
        $this->assertSame(8, $inventory->fresh()->on_hand);
        $this->assertSame(0, $inventory->fresh()->reserved);
        $this->assertDatabaseHas(InventoryReservation::class, [
            'order_id' => $order->id,
            'status' => InventoryReservationStatus::Committed->value,
        ]);

        $this->expectException(DomainException::class);
        app(TransitionOrderStatus::class)->handle($paidOrder, OrderStatus::Paid);
    }

    public function test_order_cannot_skip_fulfilment_states(): void
    {
        $order = Order::factory()->paid()->create();

        $this->expectException(DomainException::class);
        app(TransitionOrderStatus::class)->handle($order, OrderStatus::Shipped);
    }

    public function test_order_cannot_expire_before_its_payment_deadline(): void
    {
        [$order, $inventory] = $this->createReservedOrder();

        try {
            app(TransitionOrderStatus::class)->handle($order, OrderStatus::Expired);
            $this->fail('An order must not expire before its deadline.');
        } catch (DomainException) {
            $this->assertSame(OrderStatus::PendingPayment, $order->fresh()->status);
            $this->assertSame(2, $inventory->fresh()->reserved);
            $this->assertDatabaseHas(InventoryReservation::class, [
                'order_id' => $order->id,
                'status' => InventoryReservationStatus::Active->value,
            ]);
        }
    }

    /** @return array{Order, InventoryItem} */
    private function createReservedOrder(): array
    {
        $variant = ProductVariant::factory()->create();
        $inventory = InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 10,
            'reserved' => 0,
        ]);
        $order = Order::factory()->create(['expires_at' => now()->addMinutes(20)]);
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
