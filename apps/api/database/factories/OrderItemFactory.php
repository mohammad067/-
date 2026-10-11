<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => null,
            'product_variant_id' => null,
            'sku' => fake()->unique()->bothify('SNAP-####-??'),
            'product_name' => 'برنج هاشمی آستانه اشرفیه',
            'variant_name' => 'بسته ۱۰ کیلویی',
            'weight_grams' => 10000,
            'unit_price_rials' => 15_000_000,
            'quantity' => 1,
            'discount_rials' => 0,
            'line_total_rials' => 15_000_000,
        ];
    }
}
