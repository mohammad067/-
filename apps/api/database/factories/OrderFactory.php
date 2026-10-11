<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'TS-'.now()->format('ymd').'-'.Str::upper(Str::random(8)),
            'user_id' => User::factory(),
            'status' => OrderStatus::PendingPayment,
            'payment_status' => PaymentStatus::Pending,
            'currency' => 'IRR',
            'subtotal_rials' => 15_000_000,
            'discount_rials' => 0,
            'shipping_rials' => 500_000,
            'tax_rials' => 0,
            'total_rials' => 15_500_000,
            'shipping_method_code' => 'standard',
            'shipping_method_name' => 'ارسال استاندارد',
            'placed_at' => now(),
            'expires_at' => now()->addMinutes(20),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => OrderStatus::Paid,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => now(),
        ]);
    }
}
