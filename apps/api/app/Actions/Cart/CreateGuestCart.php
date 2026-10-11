<?php

namespace App\Actions\Cart;

use App\Data\Cart\GuestCartCredentials;
use App\Enums\CartStatus;
use App\Models\Cart;
use Illuminate\Support\Str;

class CreateGuestCart
{
    public function handle(): GuestCartCredentials
    {
        $plainTextToken = Str::random(80);
        $cart = Cart::query()->create([
            'access_token_hash' => hash('sha256', $plainTextToken),
            'status' => CartStatus::Active,
            'currency' => 'IRR',
            'expires_at' => now()->addDays((int) config('commerce.cart.expires_after_days')),
            'last_activity_at' => now(),
        ]);

        return new GuestCartCredentials($cart, $plainTextToken);
    }
}
