<?php

namespace App\Actions\Orders;

use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Data\Orders\GuestOrderResult;
use App\Enums\CartStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductStatus;
use App\Exceptions\Domain\CartUnavailable;
use App\Exceptions\Domain\EmptyCart;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlaceGuestOrder
{
    public function __construct(private ReserveInventoryForOrder $reserveInventoryForOrder) {}

    /**
     * @param  array{
     *     customer: array{name: string, phone: string, email?: ?string},
     *     shippingAddress: array{province: string, city: string, postalCode?: ?string, addressLine: string},
     *     shippingMethod: string,
     *     customerNote?: ?string
     * }  $data
     */
    public function handle(
        string $cartPublicId,
        ?string $cartToken,
        string $idempotencyKey,
        User $user,
        array $data,
    ): GuestOrderResult {
        $cart = $this->resolveCart($cartPublicId, $cartToken);
        $idempotencyHash = hash('sha256', "guest-checkout:{$cart->public_id}:{$idempotencyKey}");

        return DB::transaction(function () use ($cart, $idempotencyHash, $idempotencyKey, $user, $data): GuestOrderResult {
            $lockedCart = Cart::query()->lockForUpdate()->findOrFail($cart->id);
            $existingOrder = Order::query()
                ->whereBelongsTo($lockedCart)
                ->whereBelongsTo($user)
                ->where('checkout_idempotency_key', $idempotencyHash)
                ->first();

            if ($existingOrder !== null) {
                return new GuestOrderResult(
                    $existingOrder->loadGuestDetails(),
                    $this->makeOrderAccessToken($existingOrder, $idempotencyKey),
                    false,
                );
            }

            if (! in_array($lockedCart->status, [CartStatus::Active, CartStatus::Abandoned], true)
                || $lockedCart->expires_at?->isPast()) {
                throw new CartUnavailable('The cart cannot be checked out.');
            }

            $cartItems = $lockedCart->items()
                ->with(['variant.product', 'variant.inventoryItem'])
                ->orderBy('product_variant_id')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new EmptyCart('The cart has no items.');
            }

            $subtotalRials = 0;
            $orderItemSnapshots = [];

            foreach ($cartItems as $cartItem) {
                $variant = $cartItem->variant;

                if (! $variant instanceof ProductVariant
                    || ! $variant->product instanceof Product
                    || $variant->status !== ProductStatus::Active
                    || $variant->product->status !== ProductStatus::Active
                    || ! $variant->product->published_at?->isPast()) {
                    throw new CartUnavailable('A cart item is no longer available.');
                }

                $lineTotalRials = $variant->price_rials * $cartItem->quantity;
                $subtotalRials += $lineTotalRials;
                $orderItemSnapshots[] = [
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'sku' => $variant->sku,
                    'product_name' => $variant->product->name,
                    'variant_name' => $variant->title,
                    'weight_grams' => $variant->weight_grams,
                    'unit_price_rials' => $variant->price_rials,
                    'quantity' => $cartItem->quantity,
                    'discount_rials' => 0,
                    'line_total_rials' => $lineTotalRials,
                ];
            }

            $shippingMethod = config("commerce.checkout.shipping_methods.{$data['shippingMethod']}");

            if (! is_array($shippingMethod)) {
                throw new CartUnavailable('The shipping method is unavailable.');
            }

            $shippingRials = (int) $shippingMethod['price_rials'];
            $order = Order::query()->create([
                'order_number' => $this->makeOrderNumber(),
                'user_id' => $user->id,
                'customer_phone' => $user->phone,
                'customer_email' => $user->email,
                'cart_id' => $lockedCart->id,
                'checkout_idempotency_key' => $idempotencyHash,
                'status' => OrderStatus::PendingPayment,
                'payment_status' => PaymentStatus::Pending,
                'currency' => 'IRR',
                'subtotal_rials' => $subtotalRials,
                'discount_rials' => 0,
                'shipping_rials' => $shippingRials,
                'tax_rials' => 0,
                'total_rials' => $subtotalRials + $shippingRials,
                'shipping_method_code' => $data['shippingMethod'],
                'shipping_method_name' => $shippingMethod['name'],
                'customer_note' => $data['customerNote'] ?? null,
                'placed_at' => now(),
                'expires_at' => now()->addMinutes((int) config('commerce.checkout.payment_window_minutes')),
            ]);

            $order->items()->createMany($orderItemSnapshots);
            $order->addresses()->create([
                'type' => 'shipping',
                'recipient_name' => $data['customer']['name'],
                'phone' => $data['customer']['phone'],
                'province' => $data['shippingAddress']['province'],
                'city' => $data['shippingAddress']['city'],
                'postal_code' => $data['shippingAddress']['postalCode'] ?? null,
                'address_line' => $data['shippingAddress']['addressLine'],
            ]);
            $order->statusHistory()->create([
                'from_status' => null,
                'to_status' => OrderStatus::PendingPayment,
                'reason' => 'guest_checkout_created',
            ]);

            $this->reserveInventoryForOrder->handle($order);

            $plainTextOrderToken = $this->makeOrderAccessToken($order, $idempotencyKey);
            $order->update(['access_token_hash' => hash('sha256', $plainTextOrderToken)]);
            $lockedCart->update([
                'status' => CartStatus::Converted,
                'last_activity_at' => now(),
                'recovered_at' => $lockedCart->status === CartStatus::Abandoned ? now() : $lockedCart->recovered_at,
            ]);

            return new GuestOrderResult($order->loadGuestDetails(), $plainTextOrderToken, true);
        }, attempts: 3);
    }

    private function resolveCart(string $publicId, ?string $plainTextToken): Cart
    {
        if ($plainTextToken === null || $plainTextToken === '') {
            throw (new ModelNotFoundException)->setModel(Cart::class);
        }

        return Cart::query()
            ->where('public_id', $publicId)
            ->where('access_token_hash', hash('sha256', $plainTextToken))
            ->whereIn('status', [
                CartStatus::Active->value,
                CartStatus::Abandoned->value,
                CartStatus::Converted->value,
            ])
            ->firstOrFail();
    }

    private function makeOrderNumber(): string
    {
        return 'TS-'.now()->format('ymd').'-'.Str::upper(Str::random(10));
    }

    private function makeOrderAccessToken(Order $order, string $idempotencyKey): string
    {
        return hash_hmac(
            'sha256',
            "guest-order:{$order->public_id}:{$idempotencyKey}",
            (string) config('app.key'),
        );
    }
}
