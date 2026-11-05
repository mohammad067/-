<?php

namespace App\Actions\Orders;

use App\Actions\Inventory\CommitInventoryForOrder;
use App\Actions\Inventory\ReleaseInventoryForOrder;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;

class TransitionOrderStatus
{
    public function __construct(
        private ReleaseInventoryForOrder $releaseInventoryForOrder,
        private CommitInventoryForOrder $commitInventoryForOrder,
    ) {}

    /** @return array<int, OrderStatus> */
    public static function allowedTargets(OrderStatus $status): array
    {
        return match ($status) {
            OrderStatus::PendingPayment => [OrderStatus::Paid, OrderStatus::Cancelled, OrderStatus::Expired],
            OrderStatus::Paid => [OrderStatus::Processing, OrderStatus::Refunded],
            OrderStatus::Processing => [OrderStatus::Shipped, OrderStatus::Refunded],
            OrderStatus::Shipped => [OrderStatus::Delivered, OrderStatus::Refunded],
            OrderStatus::Delivered => [OrderStatus::Refunded],
            default => [],
        };
    }

    /** @return array<int, OrderStatus> */
    public static function allowedTargetsFor(Order $order): array
    {
        return array_values(array_filter(
            self::allowedTargets($order->status),
            fn (OrderStatus $target): bool => self::meetsTransitionRequirements($order, $target),
        ));
    }

    public function handle(Order $order, OrderStatus $target, ?User $actor = null, ?string $reason = null): Order
    {
        return DB::transaction(function () use ($order, $target, $actor, $reason): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);
            $from = $lockedOrder->status;

            if (! in_array($target, self::allowedTargets($from), true)) {
                throw new DomainException("Order cannot transition from {$from->value} to {$target->value}.");
            }

            if (! self::meetsTransitionRequirements($lockedOrder, $target)) {
                throw new DomainException("Order does not meet the requirements for transition to {$target->value}.");
            }

            if ($target === OrderStatus::Paid) {
                $this->commitInventoryForOrder->handle($lockedOrder);
            }

            if (in_array($target, [OrderStatus::Cancelled, OrderStatus::Expired], true)) {
                $this->releaseInventoryForOrder->handle(
                    $lockedOrder,
                    $target === OrderStatus::Expired
                        ? InventoryReservationStatus::Expired
                        : InventoryReservationStatus::Released,
                );
            }

            $attributes = ['status' => $target];
            if ($target === OrderStatus::Cancelled) {
                $attributes['cancelled_at'] = now();
                $attributes['payment_status'] = PaymentStatus::Cancelled;
            }
            if ($target === OrderStatus::Expired) {
                $attributes['payment_status'] = PaymentStatus::Cancelled;
            }
            if ($target === OrderStatus::Paid && $lockedOrder->paid_at === null) {
                $attributes['paid_at'] = now();
            }
            if ($target === OrderStatus::Delivered) {
                $attributes['completed_at'] = now();
            }

            $lockedOrder->update($attributes);
            $lockedOrder->statusHistory()->create([
                'actor_id' => $actor?->id,
                'from_status' => $from,
                'to_status' => $target,
                'reason' => $reason,
            ]);

            return $lockedOrder->refresh();
        }, attempts: 3);
    }

    private static function meetsTransitionRequirements(Order $order, OrderStatus $target): bool
    {
        return match ($target) {
            OrderStatus::Paid => $order->payment_status === PaymentStatus::Paid,
            OrderStatus::Cancelled => $order->hasUnsettledPayment(),
            OrderStatus::Expired => $order->paymentWindowHasExpired(),
            OrderStatus::Processing,
            OrderStatus::Shipped,
            OrderStatus::Delivered => in_array($order->payment_status, [
                PaymentStatus::Paid,
                PaymentStatus::PartiallyRefunded,
            ], true),
            OrderStatus::Refunded => $order->payment_status === PaymentStatus::Refunded,
            default => true,
        };
    }
}
