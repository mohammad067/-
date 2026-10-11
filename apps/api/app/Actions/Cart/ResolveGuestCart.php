<?php

namespace App\Actions\Cart;

use App\Enums\CartStatus;
use App\Models\Cart;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ResolveGuestCart
{
    public function handle(string $publicId, ?string $plainTextToken): Cart
    {
        if ($plainTextToken === null || $plainTextToken === '') {
            throw (new ModelNotFoundException)->setModel(Cart::class);
        }

        $cart = Cart::query()
            ->where('public_id', $publicId)
            ->where('access_token_hash', hash('sha256', $plainTextToken))
            ->whereIn('status', [CartStatus::Active->value, CartStatus::Abandoned->value])
            ->where(function ($query): void {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->firstOrFail();

        if ($cart->status === CartStatus::Abandoned) {
            $cart->update([
                'status' => CartStatus::Active,
                'last_activity_at' => now(),
                'recovered_at' => now(),
            ]);
        }

        return $cart;
    }
}
