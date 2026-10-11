<?php

namespace Tests\Feature\Api\V1;

use App\Actions\Cart\CreateGuestCart;
use App\Enums\CartStatus;
use App\Enums\InventoryReservationStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class GuestCheckoutApiTest extends TestCase
{
    use RefreshDatabase;

    private ?User $authUser = null;

    private ?string $authToken = null;

    public function test_authenticated_customer_can_place_and_read_an_order(): void
    {
        [$cart, $cartToken, $variant, $inventoryItem] = $this->createCartWithItem();

        $response = $this->postGuestOrder($cart, $cartToken, 'checkout-request-0000000000000001', [
            'user_id' => 999,
            'totalRials' => 1,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.status', OrderStatus::PendingPayment->value)
            ->assertJsonPath('data.paymentStatus', PaymentStatus::Pending->value)
            ->assertJsonPath('data.customer.phone', '+989121234567')
            ->assertJsonPath('data.totals.subtotalRials', 29_000_000)
            ->assertJsonPath('data.totals.shippingRials', 500_000)
            ->assertJsonPath('data.totals.totalRials', 29_500_000)
            ->assertJsonPath('data.items.0.unitPriceRials', 14_500_000)
            ->assertJsonPath('data.items.0.quantity', 2)
            ->assertJsonPath('data.shippingAddress.city', 'رشت')
            ->assertJsonPath('data.canPay', true);

        $order = Order::query()->where('public_id', $response->json('data.id'))->firstOrFail();
        $this->assertSame($this->authUser?->id, $order->user_id);
        $this->assertSame($cart->id, $order->cart_id);
        $this->assertSame('+989121234567', $order->customer_phone);
        $this->assertSame(29_500_000, $order->total_rials);
        $this->assertSame(CartStatus::Converted, $cart->fresh()->status);
        $this->assertSame(2, $inventoryItem->fresh()->reserved);
        $this->assertDatabaseHas(OrderItem::class, [
            'order_id' => $order->id,
            'product_variant_id' => $variant->id,
            'unit_price_rials' => 14_500_000,
            'quantity' => 2,
            'line_total_rials' => 29_000_000,
        ]);
        $this->assertDatabaseHas(OrderAddress::class, [
            'order_id' => $order->id,
            'recipient_name' => 'رضا احمدی',
            'phone' => '+989121234567',
            'city' => 'رشت',
        ]);
        $this->assertDatabaseHas(InventoryReservation::class, [
            'order_id' => $order->id,
            'status' => InventoryReservationStatus::Active->value,
            'quantity' => 2,
        ]);

        $this->getJson(
            route('api.v1.orders.show', $order->public_id),
            $this->authHeaders(),
        )
            ->assertOk()
            ->assertJsonPath('data.orderNumber', $order->order_number);

        $otherToken = 'other-user-auth-token-that-is-long-enough';
        User::factory()->create()->apiTokens()->create([
            'token_hash' => hash('sha256', $otherToken),
            'expires_at' => now()->addDay(),
        ]);
        $this->getJson(route('api.v1.orders.show', $order->public_id), [
            'Authorization' => "Bearer {$otherToken}",
        ])->assertNotFound();
    }

    public function test_retry_with_the_same_idempotency_key_returns_the_original_order(): void
    {
        [$cart, $cartToken, , $inventoryItem] = $this->createCartWithItem();
        $idempotencyKey = 'checkout-request-0000000000000002';

        $firstResponse = $this->postGuestOrder($cart, $cartToken, $idempotencyKey)->assertCreated();
        $retryResponse = $this->postGuestOrder($cart, $cartToken, $idempotencyKey)->assertOk();

        $this->assertSame($firstResponse->json('data.id'), $retryResponse->json('data.id'));
        $this->assertDatabaseCount(Order::class, 1);
        $this->assertDatabaseCount(InventoryReservation::class, 1);
        $this->assertDatabaseCount(InventoryMovement::class, 1);
        $this->assertSame(2, $inventoryItem->fresh()->reserved);
    }

    public function test_wrong_cart_token_returns_404_and_creates_nothing(): void
    {
        [$cart] = $this->createCartWithItem();

        $this->postGuestOrder(
            $cart,
            'wrong-cart-token',
            'checkout-request-0000000000000003',
        )->assertNotFound();

        $this->assertDatabaseCount(Order::class, 0);
        $this->assertDatabaseCount(InventoryReservation::class, 0);
        $this->assertSame(CartStatus::Active, $cart->fresh()->status);
    }

    public function test_empty_cart_returns_409_and_creates_nothing(): void
    {
        $credentials = app(CreateGuestCart::class)->handle();

        $this->postGuestOrder(
            $credentials->cart,
            $credentials->plainTextToken,
            'checkout-request-0000000000000004',
        )
            ->assertConflict()
            ->assertJsonPath('error.code', 'EMPTY_CART');

        $this->assertDatabaseCount(Order::class, 0);
        $this->assertSame(CartStatus::Active, $credentials->cart->fresh()->status);
    }

    public function test_insufficient_stock_rolls_back_the_order_and_cart_conversion(): void
    {
        [$cart, $cartToken, , $inventoryItem] = $this->createCartWithItem(onHand: 1);

        $this->postGuestOrder(
            $cart,
            $cartToken,
            'checkout-request-0000000000000005',
        )
            ->assertConflict()
            ->assertJsonPath('error.code', 'INSUFFICIENT_STOCK');

        $this->assertDatabaseCount(Order::class, 0);
        $this->assertDatabaseCount(OrderItem::class, 0);
        $this->assertDatabaseCount(InventoryReservation::class, 0);
        $this->assertSame(CartStatus::Active, $cart->fresh()->status);
        $this->assertSame(0, $inventoryItem->fresh()->reserved);
    }

    public function test_invalid_guest_checkout_payload_returns_422(): void
    {
        $credentials = app(CreateGuestCart::class)->handle();

        $this->postJson(
            route('api.v1.orders.store'),
            [
                'cartId' => $credentials->cart->public_id,
                'customer' => ['name' => '', 'phone' => '123', 'role' => 'admin'],
                'shippingAddress' => [],
                'shippingMethod' => 'unknown',
            ],
            [
                ...$this->authHeaders(),
                'X-Cart-Token' => $credentials->plainTextToken,
            ],
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                '_idempotency_key',
                'customer',
                'customer.name',
                'customer.phone',
                'shippingAddress.province',
                'shippingAddress.city',
                'shippingAddress.addressLine',
                'shippingMethod',
            ]);

        $this->assertDatabaseCount(Order::class, 0);
    }

    /** @return array{Cart, string, ProductVariant, InventoryItem} */
    private function createCartWithItem(int $onHand = 10): array
    {
        $credentials = app(CreateGuestCart::class)->handle();
        $variant = ProductVariant::factory()->create(['price_rials' => 14_500_000]);
        $inventoryItem = InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => $onHand,
            'reserved' => 0,
        ]);
        CartItem::factory()->create([
            'cart_id' => $credentials->cart->id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);

        return [$credentials->cart, $credentials->plainTextToken, $variant, $inventoryItem];
    }

    /** @param array<string, mixed> $overrides */
    private function postGuestOrder(
        Cart $cart,
        string $cartToken,
        string $idempotencyKey,
        array $overrides = [],
    ): TestResponse {
        return $this->postJson(
            route('api.v1.orders.store'),
            array_replace_recursive([
                'cartId' => $cart->public_id,
                'customer' => [
                    'name' => 'رضا احمدی',
                    'phone' => '۰۹۱۲۱۲۳۴۵۶۷',
                    'email' => 'reza@example.com',
                ],
                'shippingAddress' => [
                    'province' => 'گیلان',
                    'city' => 'رشت',
                    'postalCode' => '۴۱۹۳۶۱۳۳۱۱',
                    'addressLine' => 'خیابان معلم، کوچه شالیزار، پلاک ۱۰',
                ],
                'shippingMethod' => 'standard',
                'customerNote' => 'بعدازظهر تحویل داده شود.',
            ], $overrides),
            [
                ...$this->authHeaders(),
                'X-Cart-Token' => $cartToken,
                'X-Idempotency-Key' => $idempotencyKey,
            ],
        );
    }

    /** @return array<string, string> */
    private function authHeaders(): array
    {
        if ($this->authUser === null || $this->authToken === null) {
            $this->authUser = User::factory()->create([
                'phone' => '+989121234567',
                'email' => 'reza@example.com',
            ]);
            $this->authToken = 'test-auth-token-that-is-at-least-thirty-two-characters';
            $this->authUser->apiTokens()->create([
                'token_hash' => hash('sha256', $this->authToken),
                'expires_at' => now()->addDay(),
            ]);
        }

        return ['Authorization' => "Bearer {$this->authToken}"];
    }
}
