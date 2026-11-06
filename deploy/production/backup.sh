#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

CONFIG_FILE="${TALAYE_BACKUP_CONFIG:-/etc/talaye-shalizar/backup.env}"
STATE_DIRECTORY="${TALAYE_BACKUP_STATE_DIRECTORY:-/run/talaye-backup}"

if [[ ! -r "${CONFIG_FILE}" ]]; then
    echo "Backup configuration is not readable: ${CONFIG_FILE}" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "${CONFIG_FILE}"

: "${BACKUP_DIRECTORY:?BACKUP_DIRECTORY is required}"
: "${BACKUP_RETENTION_DAYS:?BACKUP_RETENTION_DAYS is required}"
: "${APP_DIRECTORY:?APP_DIRECTORY is required}"
: "${APP_USER:?APP_USER is required}"
: "${QUEUE_SERVICE:?QUEUE_SERVICE is required}"
: "${PHP_FPM_SERVICE:?PHP_FPM_SERVICE is required}"
: "${DB_DATABASE:?DB_DATABASE is required}"
: "${DB_CREDENTIALS_FILE:?DB_CREDENTIALS_FILE is required}"

for command in flock git gzip id mariadb mariadb-dump php runuser sha256sum systemctl tar; do
    command -v "${command}" >/dev/null 2>&1 || {
        echo "Required command is missing: ${command}" >&2
        exit 1
    }
done

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
    echo "Application user does not exist: ${APP_USER}" >&2
    exit 1
fi

if [[ ! -r "${DB_CREDENTIALS_FILE}" ]]; then
    echo "MariaDB credentials are not readable: ${DB_CREDENTIALS_FILE}" >&2
    exit 1
fi

run_artisan() {
    runuser -u "${APP_USER}" -- php "${APP_DIRECTORY}/artisan" "$@"
}

mkdir -p "${BACKUP_DIRECTORY}"
mkdir -p -m 0700 "${STATE_DIRECTORY}"

exec 9>/run/lock/talaye-maintenance.lock
if ! flock -n 9; then
    echo 'A backup or deployment is already running.' >&2
    exit 1
fi

timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
snapshot_name="talaye-shalizar-${timestamp}"
temporary_directory="$(mktemp -d "${BACKUP_DIRECTORY}/.${snapshot_name}.XXXXXX")"
snapshot_directory="${BACKUP_DIRECTORY}/${snapshot_name}"
queue_was_active=0
php_fpm_was_active=0
queue_marker="${STATE_DIRECTORY}/queue.was-active"
php_fpm_marker="${STATE_DIRECTORY}/php-fpm.was-active"

cleanup() {
    local exit_code=$?
    local cleanup_failed=0

    trap - EXIT INT TERM

    if [[ "${php_fpm_was_active}" -eq 1 ]]; then
        if ! systemctl start "${PHP_FPM_SERVICE}"; then
            echo "Failed to restart ${PHP_FPM_SERVICE}." >&2
            cleanup_failed=1
        else
            rm -f "${php_fpm_marker}"
        fi
    fi

    if [[ "${queue_was_active}" -eq 1 ]]; then
        if ! systemctl start "${QUEUE_SERVICE}"; then
            echo "Failed to restart ${QUEUE_SERVICE}." >&2
            cleanup_failed=1
        else
            rm -f "${queue_marker}"
        fi
    fi

    if [[ "${exit_code}" -ne 0 || "${cleanup_failed}" -ne 0 ]]; then
        rm -rf "${temporary_directory}"
    fi

    if [[ "${exit_code}" -eq 0 && "${cleanup_failed}" -ne 0 ]]; then
        exit_code=1
    fi

    exit "${exit_code}"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

queue_state="$(systemctl show --property=ActiveState --value "${QUEUE_SERVICE}")"
if [[ "${queue_state}" == 'active' || "${queue_state}" == 'activating' || "${queue_state}" == 'reloading' ]]; then
    queue_was_active=1
    : >"${queue_marker}"
fi

php_fpm_state="$(systemctl show --property=ActiveState --value "${PHP_FPM_SERVICE}")"
if [[ "${php_fpm_state}" == 'active' || "${php_fpm_state}" == 'activating' || "${php_fpm_state}" == 'reloading' ]]; then
    php_fpm_was_active=1
    : >"${php_fpm_marker}"
fi

if [[ "${queue_was_active}" -eq 1 ]]; then
    systemctl stop "${QUEUE_SERVICE}"
fi

if [[ "${php_fpm_was_active}" -eq 1 ]]; then
    systemctl stop "${PHP_FPM_SERVICE}"
fi

# Wait for a running scheduler invocation and prevent the next one from
# starting until the database and media snapshot has completed.
exec 8>/run/lock/talaye-scheduler.lock
flock -w 120 8

mariadb-dump \
    --defaults-extra-file="${DB_CREDENTIALS_FILE}" \
    --single-transaction \
    --quick \
    --skip-lock-tables \
    --no-tablespaces \
    --hex-blob \
    --events \
    --triggers \
    --add-drop-table \
    "${DB_DATABASE}" \
    | gzip -9 >"${temporary_directory}/database.sql.gz"

tar -C "${APP_DIRECTORY}" -czf "${temporary_directory}/storage-app.tar.gz" storage/app

run_artisan migrate:status --no-ansi \
    >"${temporary_directory}/migrations.txt"

app_key_fingerprint="$(runuser -u "${APP_USER}" -- php -r '
$app = require $argv[1];
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo hash("sha256", (string) config("app.key"));
' "${APP_DIRECTORY}/bootstrap/app.php")"
release_id="$(runuser -u "${APP_USER}" -- git -C "${APP_DIRECTORY}" rev-parse HEAD 2>/dev/null || printf 'unknown')"

{
    echo "created_at_utc=${timestamp}"
    echo "release_id=${release_id}"
    echo "php_version=$(php -r 'echo PHP_VERSION;')"
    echo "mariadb_version=$(mariadb --defaults-extra-file="${DB_CREDENTIALS_FILE}" --batch --skip-column-names -e 'SELECT VERSION()')"
    echo "database=${DB_DATABASE}"
    echo "app_key_sha256=${app_key_fingerprint}"
} >"${temporary_directory}/metadata.txt"

gzip -t "${temporary_directory}/database.sql.gz"
tar -tzf "${temporary_directory}/storage-app.tar.gz" >/dev/null

(
    cd "${temporary_directory}"
    sha256sum database.sql.gz storage-app.tar.gz migrations.txt metadata.txt >SHA256SUMS
    sha256sum --check SHA256SUMS
)

mv "${temporary_directory}" "${snapshot_directory}"

find "${BACKUP_DIRECTORY}" \
    -mindepth 1 \
    -maxdepth 1 \
    -type d \
    -name 'talaye-shalizar-*' \
    -mtime "+${BACKUP_RETENTION_DAYS}" \
    -print \
    -exec rm -rf -- {} +

echo "Backup completed: ${snapshot_directory}"
