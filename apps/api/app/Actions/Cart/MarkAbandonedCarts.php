<?php

namespace App\Actions\Cart;

use App\Enums\CartStatus;
use App\Models\Cart;
use Carbon\CarbonInterface;

class MarkAbandonedCarts
{
    public function handle(?CarbonInterface $inactiveBefore = null): int
    {
        $inactiveBefore ??= now()->subHours((int) config('commerce.cart.abandon_after_hours'));

        return Cart::query()
            ->where('status', CartStatus::Active->value)
            ->whereNotNull('last_activity_at')
            ->where('last_activity_at', '<=', $inactiveBefore)
            ->where(function ($query): void {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->whereHas('items')
            ->whereDoesntHave('order')
            ->update([
                'status' => CartStatus::Abandoned->value,
                'abandoned_at' => now(),
                'recovered_at' => null,
                'updated_at' => now(),
            ]);
    }
}
