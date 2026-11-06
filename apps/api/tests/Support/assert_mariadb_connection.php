<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Tests\Support\EnsureIsolatedMariaDb;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$expectedDatabase = $argv[1] ?? '';
$expectedUsername = $argv[2] ?? '';
$expectedPort = $argv[3] ?? '';

if ($expectedDatabase === '' || $expectedUsername === '' || $expectedPort === '') {
    throw new RuntimeException('Expected database, username, and port arguments.');
}

EnsureIsolatedMariaDb::assert($expectedDatabase, $expectedUsername, $expectedPort);

fwrite(STDOUT, "Verified isolated MariaDB target: {$expectedDatabase}\n");
