<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
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
            'gateway' => 'fake',
            'status' => PaymentStatus::Pending,
            'amount_rials' => 15_500_000,
            'currency' => 'IRR',
            'idempotency_key' => hash('sha256', Str::uuid()->toString()),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentStatus::Paid,
            'gateway_transaction_id' => fake()->unique()->numerify('##########'),
            'verified_at' => now(),
            'paid_at' => now(),
        ]);
    }
}
