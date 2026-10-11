<?php

namespace Database\Factories;

use App\Enums\CartStatus;
use App\Models\Cart;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'access_token_hash' => hash('sha256', Str::random(64)),
            'status' => CartStatus::Active,
            'currency' => 'IRR',
            'expires_at' => now()->addDays(30),
            'last_activity_at' => now(),
        ];
    }

    public function abandoned(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => CartStatus::Abandoned,
            'last_activity_at' => now()->subDays(2),
            'abandoned_at' => now()->subDay(),
        ]);
    }
}
