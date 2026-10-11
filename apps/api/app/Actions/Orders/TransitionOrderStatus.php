<?php

namespace App\Actions\Orders;

use App\Actions\Inventory\ReleaseInventoryForOrder;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;

class TransitionOrderStatus
{
    public function __construct(private ReleaseInventoryForOrder $releaseInventoryForOrder) {}

    /** @return array<int, OrderStatus> */
    public static function allowedTargets(OrderStatus $status): array
    {
        return match ($status) {
            OrderStatus::PendingPayment => [OrderStatus::Cancelled, OrderStatus::Expired],
            OrderStatus::Paid => [OrderStatus::Processing],
            OrderStatus::Processing => [OrderStatus::Shipped],
            OrderStatus::Shipped => [OrderStatus::Delivered],
            default => [],
        };
    }

    public function handle(Order $order, OrderStatus $target, User $actor, ?string $reason = null): Order
    {
        return DB::transaction(function () use ($order, $target, $actor, $reason): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);
            $from = $lockedOrder->status;

            if (! in_array($target, self::allowedTargets($from), true)) {
                throw new DomainException("Order cannot transition from {$from->value} to {$target->value}.");
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
            }
            if ($target === OrderStatus::Delivered) {
                $attributes['completed_at'] = now();
            }

            $lockedOrder->update($attributes);
            $lockedOrder->statusHistory()->create([
                'actor_id' => $actor->id,
                'from_status' => $from,
                'to_status' => $target,
                'reason' => $reason,
            ]);

            return $lockedOrder->refresh();
        }, attempts: 3);
    }
}
