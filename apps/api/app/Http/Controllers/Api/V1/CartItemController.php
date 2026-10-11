<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Cart\RemoveCartItem;
use App\Actions\Cart\ResolveGuestCart;
use App\Actions\Cart\UpdateCartItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateCartItemRequest;
use App\Http\Resources\Api\V1\CartResource;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    public function update(
        string $cart,
        string $variant,
        UpdateCartItemRequest $request,
        ResolveGuestCart $resolveGuestCart,
        UpdateCartItem $updateCartItem,
    ): CartResource {
        $resolvedCart = $resolveGuestCart->handle($cart, $request->header('X-Cart-Token'));
        $resolvedVariant = ProductVariant::query()->where('public_id', $variant)->firstOrFail();

        return CartResource::make($updateCartItem->handle(
            $resolvedCart,
            $resolvedVariant,
            $request->integer('quantity'),
        ));
    }

    public function destroy(
        string $cart,
        string $variant,
        Request $request,
        ResolveGuestCart $resolveGuestCart,
        RemoveCartItem $removeCartItem,
    ): CartResource {
        $resolvedCart = $resolveGuestCart->handle($cart, $request->header('X-Cart-Token'));
        $resolvedVariant = ProductVariant::query()->where('public_id', $variant)->firstOrFail();

        return CartResource::make($removeCartItem->handle($resolvedCart, $resolvedVariant));
    }
}
