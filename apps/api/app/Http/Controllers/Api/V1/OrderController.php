<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Orders\PlaceGuestOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PlaceGuestOrderRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(
        PlaceGuestOrderRequest $request,
        PlaceGuestOrder $placeGuestOrder,
    ): JsonResponse {
        $validated = $request->validated();
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        $result = $placeGuestOrder->handle(
            $validated['cartId'],
            $request->header('X-Cart-Token'),
            $validated['_idempotency_key'],
            $user,
            [
                'customer' => $validated['customer'],
                'shippingAddress' => $validated['shippingAddress'],
                'shippingMethod' => $validated['shippingMethod'],
                'customerNote' => $validated['customerNote'] ?? null,
            ],
        );

        return OrderResource::make($result->order)
            ->response()
            ->setStatusCode($result->created ? 201 : 200)
            ->header('Cache-Control', 'no-store');
    }

    public function show(
        string $order,
        Request $request,
    ): OrderResource {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        return OrderResource::make(
            Order::query()
                ->where('public_id', $order)
                ->whereBelongsTo($user)
                ->firstOrFail()
                ->loadGuestDetails(),
        );
    }

    public function showByNumber(string $orderNumber, Request $request): OrderResource
    {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        return OrderResource::make(
            Order::query()
                ->where('order_number', $orderNumber)
                ->whereBelongsTo($user)
                ->firstOrFail()
                ->loadGuestDetails(),
        );
    }
}
