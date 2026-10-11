<?php

namespace Tests\Feature\Console\Commands;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarkAbandonedCartsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_marks_stale_carts_and_reports_the_count(): void
    {
        $this->travelTo('2026-10-09 12:00:00');
        config()->set('commerce.cart.abandon_after_hours', 24);
        $cart = Cart::factory()->create(['last_activity_at' => now()->subHours(25)]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_variant_id' => ProductVariant::factory(),
        ]);

        $this->artisan('carts:mark-abandoned')
            ->expectsOutput('Marked 1 cart(s) as abandoned.')
            ->assertSuccessful();

        $this->assertSame(CartStatus::Abandoned, $cart->fresh()->status);
    }
}
