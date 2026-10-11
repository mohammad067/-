<?php

namespace App\Actions\Cart;

use App\Enums\CartStatus;
use App\Enums\ProductStatus;
use App\Exceptions\Domain\InsufficientStock;
use App\Models\Cart;
use App\Models\ProductVariant;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class UpdateCartItem
{
    public function handle(Cart $cart, ProductVariant $variant, int $quantity): Cart
    {
        return DB::transaction(function () use ($cart, $variant, $quantity): Cart {
            $lockedCart = Cart::query()->lockForUpdate()->findOrFail($cart->id);

            if ($lockedCart->status !== CartStatus::Active || $lockedCart->expires_at?->isPast()) {
                throw new DomainException('The cart is not active.');
            }

            $variant->loadMissing(['product', 'inventoryItem']);

            if ($variant->status !== ProductStatus::Active
                || $variant->product->status !== ProductStatus::Active
                || ! $variant->product->published_at?->isPast()) {
                throw (new ModelNotFoundException)->setModel(ProductVariant::class);
            }

            $availableQuantity = $variant->inventoryItem?->availableQuantity() ?? 0;

            if ($variant->tracks_stock && ! $variant->allows_backorder && $availableQuantity < $quantity) {
                throw new InsufficientStock($variant->public_id, $quantity, $availableQuantity);
            }

            $lockedCart->items()->updateOrCreate(
                ['product_variant_id' => $variant->id],
                ['quantity' => $quantity],
            );
            $lockedCart->update(['last_activity_at' => now()]);

            return $lockedCart->loadStorefrontDetails();
        }, attempts: 3);
    }
}
