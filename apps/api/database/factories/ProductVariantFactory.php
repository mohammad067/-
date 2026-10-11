<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => fake()->unique()->bothify('RICE-####-??'),
            'title' => fake()->randomElement(['بسته ۵ کیلویی', 'بسته ۱۰ کیلویی']),
            'weight_grams' => fake()->randomElement([5000, 10000]),
            'price_rials' => fake()->numberBetween(7_000_000, 25_000_000),
            'compare_at_price_rials' => null,
            'cost_price_rials' => null,
            'position' => 0,
            'status' => ProductStatus::Active,
            'tracks_stock' => true,
            'allows_backorder' => false,
            'low_stock_threshold' => 5,
        ];
    }
}
