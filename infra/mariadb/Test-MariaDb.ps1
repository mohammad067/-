[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repositoryRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$apiDirectory = Join-Path $repositoryRoot 'apps\api'
$environmentFile = Join-Path $PSScriptRoot '.env'
$composeFile = Join-Path $PSScriptRoot 'compose.yaml'

if (-not (Test-Path -LiteralPath $environmentFile)) {
    throw 'Run infra/mariadb/Initialize-MariaDb.ps1 first.'
}

$settings = @{}
foreach ($line in Get-Content -LiteralPath $environmentFile) {
    $trimmed = $line.Trim()

    if ($trimmed.Length -eq 0 -or $trimmed.StartsWith('#')) {
        continue
    }

    $parts = $trimmed.Split('=', 2)
    $settings[$parts[0]] = $parts[1]
}

if ($settings['MARIADB_TEST_DATABASE'] -ne 'talaye_shalizar_test' -or
    $settings['MARIADB_TEST_USER'] -ne 'talaye_test' -or
    $settings['MARIADB_PORT'] -ne '3307') {
    throw 'The integration suite requires talaye_shalizar_test / talaye_test on local port 3307.'
}

$migrationTestDatabase = "$($settings['MARIADB_DATABASE'])_migration_test"
if ($migrationTestDatabase -notmatch '^[A-Za-z0-9_]+_test$') {
    throw 'The migration validation database must be an isolated *_test schema.'
}

$containerId = (& docker compose --env-file $environmentFile -f $composeFile ps -q mariadb).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($containerId)) {
    throw 'The project MariaDB container is not running.'
}

$containerRunning = (& docker inspect --format '{{.State.Running}}' $containerId).Trim()
if ($LASTEXITCODE -ne 0 -or $containerRunning -ne 'true') {
    throw 'The project MariaDB container is not running.'
}

$managedVariables = @(
    'APP_ENV', 'DB_CONNECTION', 'DB_URL', 'DB_HOST', 'DB_PORT', 'DB_DATABASE',
    'DB_USERNAME', 'DB_PASSWORD', 'DB_CHARSET', 'DB_COLLATION', 'DB_ENGINE',
    'DB_TIMEZONE', 'REQUIRE_MARIADB'
)
$originalValues = @{}

foreach ($name in $managedVariables) {
    $originalValues[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}

function Set-DatabaseEnvironment([string] $database, [string] $username, [string] $password) {
    $env:APP_ENV = 'testing'
    $env:DB_CONNECTION = 'mariadb'
    $env:DB_URL = ''
    $env:DB_HOST = '127.0.0.1'
    $env:DB_PORT = $settings['MARIADB_PORT']
    $env:DB_DATABASE = $database
    $env:DB_USERNAME = $username
    $env:DB_PASSWORD = $password
    $env:DB_CHARSET = 'utf8mb4'
    $env:DB_COLLATION = 'utf8mb4_unicode_ci'
    $env:DB_ENGINE = 'InnoDB'
    $env:DB_TIMEZONE = '+00:00'
}

Push-Location $apiDirectory
try {
    Write-Host 'Validating every migration on the production-like MariaDB schema...'
    Set-DatabaseEnvironment `
        $migrationTestDatabase `
        $settings['MARIADB_MIGRATOR_USER'] `
        $settings['MARIADB_MIGRATOR_PASSWORD']
    $env:REQUIRE_MARIADB = 'false'

    & php artisan config:clear --quiet
    if ($LASTEXITCODE -ne 0) {
        throw 'Laravel configuration cache could not be cleared safely.'
    }

    & php tests\Support\assert_mariadb_connection.php `
        $migrationTestDatabase `
        $settings['MARIADB_MIGRATOR_USER'] `
        $settings['MARIADB_PORT']
    if ($LASTEXITCODE -ne 0) {
        throw 'The migration target did not pass the isolated database guard.'
    }

    & php artisan migrate:fresh --seed --force
    if ($LASTEXITCODE -ne 0) {
        throw 'MariaDB migration validation failed.'
    }

    Write-Host 'Running the complete order, inventory, account, and API suite on MariaDB...'
    Set-DatabaseEnvironment `
        $settings['MARIADB_TEST_DATABASE'] `
        $settings['MARIADB_TEST_USER'] `
        $settings['MARIADB_TEST_PASSWORD']
    $env:REQUIRE_MARIADB = 'true'

    & php artisan config:clear --quiet
    if ($LASTEXITCODE -ne 0) {
        throw 'Laravel configuration cache could not be cleared safely.'
    }

    & php tests\Support\assert_mariadb_connection.php `
        $settings['MARIADB_TEST_DATABASE'] `
        $settings['MARIADB_TEST_USER'] `
        $settings['MARIADB_PORT']
    if ($LASTEXITCODE -ne 0) {
        throw 'The PHPUnit target did not pass the isolated database guard.'
    }

    & .\vendor\bin\phpunit.bat -c phpunit.mariadb.xml --do-not-cache-result
    if ($LASTEXITCODE -ne 0) {
        throw 'The MariaDB integration test suite failed.'
    }

    Write-Host 'Running the two-process inventory concurrency probe...'
    & php tests\Support\run_inventory_concurrency.php
    if ($LASTEXITCODE -ne 0) {
        throw 'The MariaDB inventory concurrency probe failed.'
    }
}
finally {
    Pop-Location

    foreach ($name in $managedVariables) {
        [Environment]::SetEnvironmentVariable($name, $originalValues[$name], 'Process')
    }
}

Write-Host 'MariaDB migrations and the complete Laravel suite passed.'
