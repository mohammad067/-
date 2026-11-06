[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$infraDirectory = $PSScriptRoot
$environmentFile = Join-Path $infraDirectory '.env'
$composeFile = Join-Path $infraDirectory 'compose.yaml'

function New-RandomSecret {
    $bytes = [byte[]]::new(32)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)

    return [Convert]::ToHexString($bytes).ToLowerInvariant()
}

function Read-EnvironmentFile([string] $path) {
    $values = @{}

    foreach ($line in Get-Content -LiteralPath $path) {
        $trimmed = $line.Trim()

        if ($trimmed.Length -eq 0 -or $trimmed.StartsWith('#')) {
            continue
        }

        $parts = $trimmed.Split('=', 2)
        $values[$parts[0]] = $parts[1]
    }

    return $values
}

function Assert-SafeIdentifier([string] $name, [string] $value) {
    if ($value -notmatch '^[A-Za-z0-9_]+$') {
        throw "$name may only contain letters, numbers, and underscores."
    }
}

function Escape-SqlLiteral([string] $value) {
    return $value.Replace("'", "''")
}

if (-not (Test-Path -LiteralPath $environmentFile)) {
    $lines = @(
        'MARIADB_PORT=3307',
        "MARIADB_ROOT_PASSWORD=$(New-RandomSecret)",
        'MARIADB_DATABASE=talaye_shalizar',
        'MARIADB_TEST_DATABASE=talaye_shalizar_test',
        'MARIADB_APP_USER=talaye_app',
        "MARIADB_APP_PASSWORD=$(New-RandomSecret)",
        'MARIADB_MIGRATOR_USER=talaye_migrator',
        "MARIADB_MIGRATOR_PASSWORD=$(New-RandomSecret)",
        'MARIADB_TEST_USER=talaye_test',
        "MARIADB_TEST_PASSWORD=$(New-RandomSecret)",
        'MARIADB_BACKUP_USER=talaye_backup',
        "MARIADB_BACKUP_PASSWORD=$(New-RandomSecret)"
    )

    [System.IO.File]::WriteAllLines(
        $environmentFile,
        $lines,
        [System.Text.UTF8Encoding]::new($false)
    )

    Write-Host 'Created the ignored infra/mariadb/.env file with random local secrets.'
}

$settings = Read-EnvironmentFile $environmentFile
$requiredKeys = @(
    'MARIADB_ROOT_PASSWORD',
    'MARIADB_DATABASE',
    'MARIADB_TEST_DATABASE',
    'MARIADB_APP_USER',
    'MARIADB_APP_PASSWORD',
    'MARIADB_MIGRATOR_USER',
    'MARIADB_MIGRATOR_PASSWORD',
    'MARIADB_TEST_USER',
    'MARIADB_TEST_PASSWORD',
    'MARIADB_BACKUP_USER',
    'MARIADB_BACKUP_PASSWORD'
)

foreach ($key in $requiredKeys) {
    if (-not $settings.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($settings[$key])) {
        throw "Missing $key in $environmentFile"
    }
}

foreach ($key in @('MARIADB_DATABASE', 'MARIADB_TEST_DATABASE', 'MARIADB_APP_USER', 'MARIADB_MIGRATOR_USER', 'MARIADB_TEST_USER', 'MARIADB_BACKUP_USER')) {
    Assert-SafeIdentifier $key $settings[$key]
}

& docker compose --env-file $environmentFile -f $composeFile up -d
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Compose could not start MariaDB.'
}

$deadline = (Get-Date).AddMinutes(2)
do {
    $health = & docker inspect --format '{{.State.Health.Status}}' talaye-mariadb 2>$null

    if ($health -eq 'healthy') {
        break
    }

    Start-Sleep -Seconds 2
} while ((Get-Date) -lt $deadline)

if ($health -ne 'healthy') {
    throw 'MariaDB did not become healthy within two minutes.'
}

$database = $settings['MARIADB_DATABASE']
$migrationTestDatabase = "${database}_migration_test"
$testDatabase = $settings['MARIADB_TEST_DATABASE']
$appUser = $settings['MARIADB_APP_USER']
$migratorUser = $settings['MARIADB_MIGRATOR_USER']
$testUser = $settings['MARIADB_TEST_USER']
$backupUser = $settings['MARIADB_BACKUP_USER']
$appPassword = Escape-SqlLiteral $settings['MARIADB_APP_PASSWORD']
$migratorPassword = Escape-SqlLiteral $settings['MARIADB_MIGRATOR_PASSWORD']
$testPassword = Escape-SqlLiteral $settings['MARIADB_TEST_PASSWORD']
$backupPassword = Escape-SqlLiteral $settings['MARIADB_BACKUP_PASSWORD']
$rootPassword = $settings['MARIADB_ROOT_PASSWORD']

$sql = @"
CREATE DATABASE IF NOT EXISTS ``$database`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS ``$migrationTestDatabase`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS ``$testDatabase`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '$appUser'@'%' IDENTIFIED BY '$appPassword';
ALTER USER '$appUser'@'%' IDENTIFIED BY '$appPassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON ``$database``.* TO '$appUser'@'%';

CREATE USER IF NOT EXISTS '$migratorUser'@'%' IDENTIFIED BY '$migratorPassword';
ALTER USER '$migratorUser'@'%' IDENTIFIED BY '$migratorPassword';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES ON ``$database``.* TO '$migratorUser'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES ON ``$migrationTestDatabase``.* TO '$migratorUser'@'%';

CREATE USER IF NOT EXISTS '$testUser'@'%' IDENTIFIED BY '$testPassword';
ALTER USER '$testUser'@'%' IDENTIFIED BY '$testPassword';
GRANT ALL PRIVILEGES ON ``$testDatabase``.* TO '$testUser'@'%';

CREATE USER IF NOT EXISTS '$backupUser'@'%' IDENTIFIED BY '$backupPassword';
ALTER USER '$backupUser'@'%' IDENTIFIED BY '$backupPassword';
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT ON ``$database``.* TO '$backupUser'@'%';
"@

$containerId = (& docker compose --env-file $environmentFile -f $composeFile ps -q mariadb).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($containerId)) {
    throw 'The MariaDB container could not be identified.'
}

$rootCredentialsFile = Join-Path (
    [System.IO.Path]::GetTempPath()
) "talaye-mariadb-root-$([Guid]::NewGuid().ToString('N')).cnf"
$containerCredentialsFile = '/tmp/talaye-mariadb-root.cnf'

[System.IO.File]::WriteAllLines(
    $rootCredentialsFile,
    @('[client]', 'user=root', "password=$rootPassword"),
    [System.Text.UTF8Encoding]::new($false)
)

try {
    & docker cp $rootCredentialsFile "${containerId}:$containerCredentialsFile"
    if ($LASTEXITCODE -ne 0) {
        throw 'The temporary MariaDB credentials could not be copied into the container.'
    }

    & docker exec $containerId chmod 0600 $containerCredentialsFile
    if ($LASTEXITCODE -ne 0) {
        throw 'The temporary MariaDB credentials could not be protected.'
    }

    $sql | & docker exec -i $containerId mariadb `
        "--defaults-extra-file=$containerCredentialsFile" `
        --protocol=socket
    if ($LASTEXITCODE -ne 0) {
        throw 'MariaDB users or grants could not be initialized.'
    }
}
finally {
    Remove-Item -LiteralPath $rootCredentialsFile -Force -ErrorAction SilentlyContinue
    & docker exec $containerId rm -f -- $containerCredentialsFile 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw 'The temporary MariaDB credentials could not be removed from the container.'
    }
}

Write-Host "MariaDB is ready on 127.0.0.1:$($settings['MARIADB_PORT'])."
Write-Host "Runtime database/user: $database / $appUser"
Write-Host "Test database/user: $testDatabase / $testUser"
