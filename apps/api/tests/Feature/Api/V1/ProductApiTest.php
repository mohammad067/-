<?php

namespace Tests\Feature\Api\V1;

use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_only_published_products_with_sellable_variants(): void
    {
        $published = Product::factory()->create([
            'name' => 'برنج هاشمی ممتاز',
            'slug' => 'published-rice',
            'published_at' => now()->subMinute(),
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $published->id,
            'price_rials' => 14_500_000,
            'cost_price_rials' => 9_000_000,
        ]);
        InventoryItem::query()->create([
            'product_variant_id' => $variant->id,
            'on_hand' => 10,
            'reserved' => 2,
        ]);

        Product::factory()->draft()->create(['slug' => 'draft-rice']);
        Product::factory()->create([
            'slug' => 'future-rice',
            'published_at' => now()->addDay(),
        ]);

        $response = $this->getJson(route('api.v1.products.index'));

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $published->public_id)
            ->assertJsonPath('data.0.slug', 'published-rice')
            ->assertJsonPath('data.0.variants.0.id', $variant->public_id)
            ->assertJsonPath('data.0.variants.0.priceRials', 14_500_000)
            ->assertJsonPath('data.0.variants.0.availableQuantity', 8)
            ->assertJsonMissingPath('data.0.variants.0.costPriceRials');
    }

    public function test_it_filters_products_and_bounds_pagination_size(): void
    {
        $gilan = Product::factory()->create([
            'slug' => 'gilan-rice',
            'origin_province' => 'گیلان',
            'rice_variety' => 'هاشمی',
        ]);
        ProductVariant::factory()->create(['product_id' => $gilan->id]);

        $mazandaran = Product::factory()->create([
            'slug' => 'mazandaran-rice',
            'origin_province' => 'مازندران',
            'rice_variety' => 'طارم',
        ]);
        ProductVariant::factory()->create(['product_id' => $mazandaran->id]);

        $this->getJson(route('api.v1.products.index', [
            'province' => 'گیلان',
            'variety' => 'هاشمی',
            'limit' => 20,
        ]))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $gilan->public_id);

        $this->getJson(route('api.v1.products.index', ['limit' => 51]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('limit');
    }

    public function test_it_returns_a_product_by_slug_and_hides_drafts(): void
    {
        $product = Product::factory()->create(['slug' => 'hashemi-gilan']);
        ProductVariant::factory()->create(['product_id' => $product->id]);
        $draft = Product::factory()->draft()->create(['slug' => 'hidden-draft']);
        ProductVariant::factory()->create(['product_id' => $draft->id]);

        $this->getJson(route('api.v1.products.show', $product->slug))
            ->assertOk()
            ->assertJsonPath('data.id', $product->public_id)
            ->assertJsonPath('data.slug', 'hashemi-gilan');

        $this->getJson('/api/v1/products/hidden-draft')->assertNotFound();
    }
}
