<?php

namespace App\Actions\Cart;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\ProductVariant;
use DomainException;
use Illuminate\Support\Facades\DB;

class RemoveCartItem
{
    public function handle(Cart $cart, ProductVariant $variant): Cart
    {
        return DB::transaction(function () use ($cart, $variant): Cart {
            $lockedCart = Cart::query()->lockForUpdate()->findOrFail($cart->id);

            if ($lockedCart->status !== CartStatus::Active || $lockedCart->expires_at?->isPast()) {
                throw new DomainException('The cart is not active.');
            }

            $lockedCart->items()->where('product_variant_id', $variant->id)->delete();
            $lockedCart->update(['last_activity_at' => now()]);

            return $lockedCart->loadStorefrontDetails();
        }, attempts: 3);
    }
}
