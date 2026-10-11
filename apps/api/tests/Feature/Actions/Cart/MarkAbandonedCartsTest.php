<?php

namespace Tests\Feature\Actions\Cart;

use App\Actions\Cart\MarkAbandonedCarts;
use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarkAbandonedCartsTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_inactive_non_empty_carts_are_marked_abandoned(): void
    {
        $this->travelTo('2026-10-09 12:00:00');
        $variant = ProductVariant::factory()->create();
        $staleCart = $this->createCartWithItem($variant, now()->subHours(25));
        $recentCart = $this->createCartWithItem($variant, now()->subHours(23));
        $expiredCart = $this->createCartWithItem($variant, now()->subHours(25), now()->subMinute());
        $emptyCart = Cart::factory()->create(['last_activity_at' => now()->subHours(25)]);

        $affectedRows = app(MarkAbandonedCarts::class)->handle(now()->subHours(24));

        $this->assertSame(1, $affectedRows);
        $this->assertSame(CartStatus::Abandoned, $staleCart->fresh()->status);
        $this->assertSame('2026-10-09 12:00:00', $staleCart->fresh()->abandoned_at->format('Y-m-d H:i:s'));
        $this->assertSame(CartStatus::Active, $recentCart->fresh()->status);
        $this->assertSame(CartStatus::Active, $expiredCart->fresh()->status);
        $this->assertSame(CartStatus::Active, $emptyCart->fresh()->status);

        $this->assertSame(0, app(MarkAbandonedCarts::class)->handle(now()->subHours(24)));
    }

    private function createCartWithItem(
        ProductVariant $variant,
        \DateTimeInterface $lastActivityAt,
        ?\DateTimeInterface $expiresAt = null,
    ): Cart {
        $cart = Cart::factory()->create([
            'last_activity_at' => $lastActivityAt,
            'expires_at' => $expiresAt ?? now()->addDay(),
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_variant_id' => $variant->id,
        ]);

        return $cart;
    }
}
