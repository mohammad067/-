#!/usr/bin/env bash

set -Eeuo pipefail

CONFIG_FILE="${TALAYE_BACKUP_CONFIG:-/etc/talaye-shalizar/backup.env}"
STATE_DIRECTORY="${TALAYE_BACKUP_STATE_DIRECTORY:-/run/talaye-backup}"

if [[ ! -r "${CONFIG_FILE}" ]]; then
    echo "Backup configuration is not readable: ${CONFIG_FILE}" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "${CONFIG_FILE}"

: "${QUEUE_SERVICE:?QUEUE_SERVICE is required}"
: "${PHP_FPM_SERVICE:?PHP_FPM_SERVICE is required}"

recovery_failed=0

if [[ -f "${STATE_DIRECTORY}/php-fpm.was-active" ]]; then
    if systemctl start "${PHP_FPM_SERVICE}"; then
        rm -f "${STATE_DIRECTORY}/php-fpm.was-active"
    else
        echo "Failed to recover ${PHP_FPM_SERVICE}." >&2
        recovery_failed=1
    fi
fi

if [[ -f "${STATE_DIRECTORY}/queue.was-active" ]]; then
    if systemctl start "${QUEUE_SERVICE}"; then
        rm -f "${STATE_DIRECTORY}/queue.was-active"
    else
        echo "Failed to recover ${QUEUE_SERVICE}." >&2
        recovery_failed=1
    fi
fi

exit "${recovery_failed}"
