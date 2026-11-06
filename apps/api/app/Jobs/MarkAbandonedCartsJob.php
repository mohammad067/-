<?php

namespace App\Jobs;

use App\Actions\Cart\MarkAbandonedCarts;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

final class MarkAbandonedCartsJob implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $maxExceptions = 3;

    public int $timeout = 60;

    public int $uniqueFor = 1800;

    public bool $failOnTimeout = true;

    public function __construct()
    {
        $this->onQueue('maintenance');
    }

    /** @return list<int> */
    public function backoff(): array
    {
        return [30, 90, 180];
    }

    public function uniqueId(): string
    {
        return 'carts:mark-abandoned';
    }

    public function handle(MarkAbandonedCarts $markAbandonedCarts): void
    {
        $abandoned = $markAbandonedCarts->handle();

        if ($abandoned > 0) {
            Log::info('Marked inactive carts as abandoned.', [
                'abandoned_carts' => $abandoned,
            ]);
        }
    }
}
