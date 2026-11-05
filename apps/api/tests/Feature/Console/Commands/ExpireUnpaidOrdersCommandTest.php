<?php

namespace Tests\Feature\Console\Commands;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpireUnpaidOrdersCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_expires_due_orders_and_reports_the_count(): void
    {
        $order = Order::factory()->create(['expires_at' => now()->subMinute()]);

        $this->artisan('orders:expire-unpaid', ['--chunk' => 1])
            ->expectsOutput('Expired 1 unpaid order(s).')
            ->assertSuccessful();

        $this->assertSame(OrderStatus::Expired, $order->fresh()->status);
    }

    public function test_command_rejects_an_invalid_chunk_size(): void
    {
        $this->artisan('orders:expire-unpaid', ['--chunk' => 0])
            ->expectsOutput('The --chunk option must be an integer greater than zero.')
            ->assertFailed();
    }
}
