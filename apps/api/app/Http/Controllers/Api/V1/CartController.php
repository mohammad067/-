<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Cart\CreateGuestCart;
use App\Actions\Cart\ResolveGuestCart;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CartResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function store(CreateGuestCart $createGuestCart): JsonResponse
    {
        $credentials = $createGuestCart->handle();

        return CartResource::make($credentials->cart->loadStorefrontDetails())
            ->additional(['meta' => ['cartToken' => $credentials->plainTextToken]])
            ->response()
            ->setStatusCode(201)
            ->header('Cache-Control', 'no-store');
    }

    public function show(
        string $cart,
        Request $request,
        ResolveGuestCart $resolveGuestCart,
    ): CartResource {
        $resolvedCart = $resolveGuestCart->handle($cart, $request->header('X-Cart-Token'));

        return CartResource::make($resolvedCart->loadStorefrontDetails());
    }
}
