# Restore rehearsal

Restore only into an isolated server first. Keep HTTP, queue workers, the
scheduler, mail, SMS, and payment callbacks disabled until validation finishes.

1. Select one snapshot directory and verify it before extraction:

   ```bash
   cd /var/backups/talaye-shalizar/talaye-shalizar-YYYYMMDDTHHMMSSZ
   sha256sum --check SHA256SUMS
   gzip -t database.sql.gz
   tar -tzf storage-app.tar.gz >/dev/null
   ```

2. Check out the Git commit recorded in `metadata.txt`. Restore the matching
   `APP_KEY` and `APP_PREVIOUS_KEYS` from the separate secret manager and verify
   their fingerprint against `app_key_sha256` in the metadata.

3. Create an empty MariaDB database with `utf8mb4_unicode_ci`, then import the
   dump with a temporary restore account that is not the application runtime
   user:

   ```bash
   gzip -dc database.sql.gz \
     | mariadb --defaults-extra-file=/etc/mysql/talaye-restore.cnf talaye_shalizar_restore
   ```

4. Extract `storage-app.tar.gz` into a staging directory, verify ownership and
   paths, then replace `apps/api/storage/app` while the application is stopped.
   Set ownership back to `www-data:www-data` and run `php artisan storage:link`.

5. Before enabling workers or external traffic, verify `migrate:status`, user,
   product, order, inventory, and image counts. Confirm every local
   `product_images.path` exists on disk, inspect queued jobs for stale side
   effects, and smoke-test login, catalog, admin, and one real CDN image.

6. Record the rehearsal result. Test a full restore at least monthly and keep
   encrypted copies outside the VPS; a local snapshot alone is not disaster
   recovery.
