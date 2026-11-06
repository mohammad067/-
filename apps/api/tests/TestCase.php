<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;
use Tests\Support\EnsureIsolatedMariaDb;

abstract class TestCase extends BaseTestCase
{
    protected function refreshApplication(): void
    {
        parent::refreshApplication();

        $this->guardTestingDatabase();
    }

    private function guardTestingDatabase(): void
    {
        if (! $this->app->environment('testing')) {
            throw new RuntimeException('The test suite may only run with APP_ENV=testing.');
        }

        $connection = (string) config('database.default');
        $database = (string) config("database.connections.{$connection}.database");
        $url = (string) config("database.connections.{$connection}.url");

        if (filled($url)) {
            throw new RuntimeException('DB_URL must be empty while running database tests.');
        }

        if ($connection === 'sqlite') {
            if ($database !== ':memory:') {
                throw new RuntimeException('SQLite tests must use the isolated in-memory database.');
            }

            return;
        }

        if (env('REQUIRE_MARIADB', false)) {
            EnsureIsolatedMariaDb::assert(
                expectedDatabase: 'talaye_shalizar_test',
                expectedUsername: 'talaye_test',
            );

            return;
        }

        if (! str_ends_with($database, '_test')) {
            throw new RuntimeException("Refusing to refresh non-test database [{$database}].");
        }
    }
}
