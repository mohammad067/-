<?php

declare(strict_types=1);

use App\Actions\Inventory\ReserveInventoryForOrder;
use App\Exceptions\Domain\InsufficientStock;
use App\Models\Order;
use Illuminate\Contracts\Console\Kernel;
use Tests\Support\EnsureIsolatedMariaDb;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

EnsureIsolatedMariaDb::assert(
    expectedDatabase: 'talaye_shalizar_test',
    expectedUsername: 'talaye_test',
);

$orderId = filter_var($argv[1] ?? null, FILTER_VALIDATE_INT);
$startAt = filter_var($argv[2] ?? null, FILTER_VALIDATE_FLOAT);

if ($orderId === false || $startAt === false) {
    fwrite(STDERR, "Expected an order ID and start timestamp.\n");
    exit(64);
}

while (microtime(true) < $startAt) {
    usleep(1_000);
}

try {
    $order = Order::query()->findOrFail($orderId);
    $app->make(ReserveInventoryForOrder::class)->handle($order);

    fwrite(STDOUT, "reserved\n");
    exit(0);
} catch (InsufficientStock) {
    fwrite(STDOUT, "insufficient_stock\n");
    exit(2);
} catch (Throwable $exception) {
    fwrite(STDERR, $exception::class.': '.$exception->getMessage()."\n");
    exit(1);
}
