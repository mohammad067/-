<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ExpireUnpaidOrders
{
    public function __construct(private TransitionOrderStatus $transitionOrderStatus) {}

    public function handle(?CarbonInterface $expiredBefore = null, ?int $chunkSize = null): int
    {
        $expiredBefore ??= now();
        $chunkSize ??= (int) config('commerce.checkout.expiration_chunk_size', 100);

        if ($chunkSize < 1) {
            throw new InvalidArgumentException('Expiration chunk size must be at least one.');
        }

        $expiredCount = 0;

        Order::query()
            ->select('id')
            ->where('status', OrderStatus::PendingPayment->value)
            ->whereIn('payment_status', [
                PaymentStatus::Pending->value,
                PaymentStatus::Failed->value,
                PaymentStatus::Cancelled->value,
            ])
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $expiredBefore)
            ->orderBy('id')
            ->chunkById($chunkSize, function ($orders) use ($expiredBefore, &$expiredCount): void {
                foreach ($orders as $candidate) {
                    $expired = DB::transaction(function () use ($candidate, $expiredBefore): bool {
                        $order = Order::query()->lockForUpdate()->find($candidate->id);

                        if ($order === null || ! $order->paymentWindowHasExpired($expiredBefore)) {
                            return false;
                        }

                        $this->transitionOrderStatus->handle(
                            $order,
                            OrderStatus::Expired,
                            reason: 'payment_window_expired',
                        );

                        return true;
                    }, attempts: 3);

                    if ($expired) {
                        $expiredCount++;
                    }
                }
            });

        return $expiredCount;
    }
}
