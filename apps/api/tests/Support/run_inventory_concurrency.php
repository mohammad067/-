<?php

declare(strict_types=1);

use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Tests\Support\EnsureIsolatedMariaDb;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

EnsureIsolatedMariaDb::assert(
    expectedDatabase: 'talaye_shalizar_test',
    expectedUsername: 'talaye_test',
);

$variant = null;
$orders = collect();

try {
    $variant = ProductVariant::factory()->create();
    $inventory = InventoryItem::query()->create([
        'product_variant_id' => $variant->id,
        'on_hand' => 5,
        'reserved' => 0,
    ]);

    foreach (range(1, 2) as $_) {
        $order = Order::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'quantity' => 3,
            'unit_price_rials' => 15_000_000,
            'line_total_rials' => 45_000_000,
        ]);
        $orders->push($order);
    }

    $startAt = microtime(true) + 1.0;
    $worker = __DIR__.'/reserve_inventory_worker.php';
    $processes = $orders
        ->map(fn (Order $order): Process => new Process([
            PHP_BINARY,
            $worker,
            (string) $order->id,
            (string) $startAt,
        ]))
        ->each(function (Process $process): void {
            $process->setTimeout(30);
            $process->start();
        });

    $exitCodes = $processes
        ->map(fn (Process $process): int => $process->wait())
        ->sort()
        ->values()
        ->all();

    $inventory->refresh();
    $reservationCount = InventoryReservation::query()
        ->whereIn('order_id', $orders->pluck('id'))
        ->count();
    $movementCount = InventoryMovement::query()
        ->where('product_variant_id', $variant->id)
        ->count();

    if ($exitCodes !== [0, 2]) {
        $diagnostics = $processes
            ->map(fn (Process $process): array => [
                'exit_code' => $process->getExitCode(),
                'stdout' => trim($process->getOutput()),
                'stderr' => trim($process->getErrorOutput()),
            ])
            ->all();

        throw new RuntimeException('Unexpected worker results: '.json_encode($diagnostics, JSON_UNESCAPED_SLASHES));
    }

    if ($inventory->reserved !== 3 || $reservationCount !== 1 || $movementCount !== 1) {
        throw new RuntimeException(sprintf(
            'Inventory was not protected (reserved=%d, reservations=%d, movements=%d).',
            $inventory->reserved,
            $reservationCount,
            $movementCount,
        ));
    }

    fwrite(STDOUT, json_encode([
        'result' => 'passed',
        'workers' => $exitCodes,
        'reserved' => $inventory->reserved,
        'reservations' => $reservationCount,
        'movements' => $movementCount,
    ], JSON_UNESCAPED_SLASHES).PHP_EOL);
} finally {
    if ($variant instanceof ProductVariant) {
        $orderIds = $orders->pluck('id');
        $userIds = $orders->pluck('user_id');

        DB::transaction(function () use ($variant, $orderIds, $userIds): void {
            InventoryMovement::query()->where('product_variant_id', $variant->id)->delete();
            InventoryReservation::query()->whereIn('order_id', $orderIds)->delete();
            OrderItem::query()->whereIn('order_id', $orderIds)->delete();
            Order::query()->whereIn('id', $orderIds)->delete();
            User::query()->whereIn('id', $userIds)->delete();
            InventoryItem::query()->where('product_variant_id', $variant->id)->delete();
            $variant->delete();
            $variant->product()->delete();
        });
    }
}
