<?php

namespace App\Jobs;

use App\Actions\Orders\ExpireUnpaidOrders;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

final class ExpireUnpaidOrdersJob implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $maxExceptions = 3;

    public int $timeout = 120;

    public int $uniqueFor = 600;

    public bool $failOnTimeout = true;

    public function __construct()
    {
        $this->onQueue('maintenance');
    }

    /** @return list<int> */
    public function backoff(): array
    {
        return [10, 30, 60, 120];
    }

    public function uniqueId(): string
    {
        return 'orders:expire-unpaid';
    }

    public function handle(ExpireUnpaidOrders $expireUnpaidOrders): void
    {
        $expired = $expireUnpaidOrders->handle();

        if ($expired > 0) {
            Log::info('Expired unpaid orders and released their inventory.', [
                'expired_orders' => $expired,
            ]);
        }
    }
}
