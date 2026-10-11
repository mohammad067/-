<?php

namespace Tests\Feature\Api\V1;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\InventoryItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_guest_cart_and_stores_only_the_token_hash(): void
    {
        $response = $this->postJson(route('api.v1.carts.store'));

        $response
            ->assertCreated()
            ->assertJsonPath('data.currency', 'IRR')
            ->assertJsonPath('data.itemCount', 0);

        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));

        $cart = Cart::query()->where('public_id', $response->json('data.id'))->firstOrFail();
        $plainTextToken = $response->json('meta.cartToken');

        $this->assertIsString($plainTextToken);
        $this->assertNotSame($plainTextToken, $cart->access_token_hash);
        $this->assertSame(hash('sha256', $plainTextToken), $cart->access_token_hash);
        $this->assertStringNotContainsString($cart->access_token_hash, (string) $response->getContent());
    }

    public function test_it_updates_a_cart_item_idempotently_and_calculates_totals_on_the_server(): void
    {
        [$cartId, $token] = $this->createGuestCart();
        $variant = ProductVariant::factory()->create(['price_rials' => 14_500_000]);
        InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 10,
            'reserved' => 2,
        ]);

        $payload = ['quantity' => 3, 'priceRials' => 1];
        $headers = ['X-Cart-Token' => $token];
        $url = route('api.v1.carts.items.update', [$cartId, $variant->public_id]);

        $this->putJson($url, $payload, $headers)
            ->assertOk()
            ->assertJsonPath('data.itemCount', 3)
            ->assertJsonPath('data.subtotalRials', 43_500_000)
            ->assertJsonPath('data.items.0.unitPriceRials', 14_500_000)
            ->assertJsonPath('data.items.0.availableQuantity', 8);

        $this->putJson($url, $payload, $headers)->assertOk();

        $this->assertDatabaseCount(CartItem::class, 1);
        $this->assertDatabaseHas(CartItem::class, [
            'product_variant_id' => $variant->id,
            'quantity' => 3,
        ]);
        $this->assertSame(2, $variant->inventoryItem->fresh()->reserved);
    }

    public function test_it_does_not_reveal_or_mutate_a_cart_without_the_correct_token(): void
    {
        [$cartId] = $this->createGuestCart();
        $variant = ProductVariant::factory()->create();

        $this->getJson(route('api.v1.carts.show', $cartId))->assertNotFound();
        $this->putJson(
            route('api.v1.carts.items.update', [$cartId, $variant->public_id]),
            ['quantity' => 1],
            ['X-Cart-Token' => 'wrong-token'],
        )->assertNotFound();

        $this->assertDatabaseCount(CartItem::class, 0);
    }

    public function test_it_rejects_a_quantity_above_available_stock(): void
    {
        [$cartId, $token] = $this->createGuestCart();
        $variant = ProductVariant::factory()->create();
        InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 2,
            'reserved' => 1,
        ]);

        $this->putJson(
            route('api.v1.carts.items.update', [$cartId, $variant->public_id]),
            ['quantity' => 2],
            ['X-Cart-Token' => $token],
        )
            ->assertConflict()
            ->assertJsonPath('error.code', 'INSUFFICIENT_STOCK')
            ->assertJsonPath('error.details.availableQuantity', 1);

        $this->assertDatabaseCount(CartItem::class, 0);
    }

    public function test_access_with_the_correct_token_recovers_an_abandoned_cart(): void
    {
        $this->travelTo('2026-10-09 12:00:00');
        $plainTextToken = 'known-high-entropy-cart-token-for-testing';
        $cart = Cart::factory()->abandoned()->create([
            'access_token_hash' => hash('sha256', $plainTextToken),
        ]);
        $variant = ProductVariant::factory()->create();
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);

        $this->getJson(
            route('api.v1.carts.show', $cart->public_id),
            ['X-Cart-Token' => $plainTextToken],
        )
            ->assertOk()
            ->assertJsonPath('data.status', CartStatus::Active->value)
            ->assertJsonPath('data.itemCount', 2);

        $cart->refresh();

        $this->assertSame(CartStatus::Active, $cart->status);
        $this->assertSame('2026-10-09 12:00:00', $cart->recovered_at->format('Y-m-d H:i:s'));
        $this->assertNotNull($cart->abandoned_at);
        $this->assertDatabaseHas(CartItem::class, [
            'cart_id' => $cart->id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);
    }

    /** @return array{string, string} */
    private function createGuestCart(): array
    {
        $response = $this->postJson(route('api.v1.carts.store'))->assertCreated();

        return [$response->json('data.id'), $response->json('meta.cartToken')];
    }
}
