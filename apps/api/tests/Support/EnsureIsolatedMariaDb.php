<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Support\Facades\DB;
use RuntimeException;

final class EnsureIsolatedMariaDb
{
    public static function assert(
        string $expectedDatabase,
        string $expectedUsername,
        string $expectedPort = '3307',
    ): void {
        if (! app()->environment('testing')) {
            throw new RuntimeException('MariaDB integration tools require APP_ENV=testing.');
        }

        $connection = (string) config('database.default');
        $configuration = (array) config("database.connections.{$connection}", []);
        $database = (string) ($configuration['database'] ?? '');
        $host = (string) ($configuration['host'] ?? '');
        $port = (string) ($configuration['port'] ?? '');
        $username = (string) ($configuration['username'] ?? '');
        $url = (string) ($configuration['url'] ?? '');
        $socket = (string) ($configuration['unix_socket'] ?? '');

        if ($connection !== 'mariadb') {
            throw new RuntimeException('The MariaDB integration tools require DB_CONNECTION=mariadb.');
        }

        if (filled($url) || filled($socket)) {
            throw new RuntimeException('DB_URL and DB_SOCKET must be empty for isolated MariaDB tests.');
        }

        if ($host !== '127.0.0.1' || $port !== $expectedPort) {
            throw new RuntimeException("Refusing MariaDB test target [{$host}:{$port}].");
        }

        if ($database !== $expectedDatabase || ! str_ends_with($database, '_test')) {
            throw new RuntimeException("Refusing non-isolated MariaDB database [{$database}].");
        }

        if ($username !== $expectedUsername) {
            throw new RuntimeException("Refusing unexpected MariaDB user [{$username}].");
        }

        $identity = DB::connection()->selectOne(
            'SELECT DATABASE() AS database_name, CURRENT_USER() AS authenticated_user',
        );
        $actualDatabase = (string) ($identity->database_name ?? '');
        $actualUsername = explode('@', (string) ($identity->authenticated_user ?? ''), 2)[0];

        if ($actualDatabase !== $expectedDatabase || $actualUsername !== $expectedUsername) {
            throw new RuntimeException('MariaDB server identity does not match the isolated test target.');
        }
    }
}
