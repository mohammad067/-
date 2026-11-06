# Production deployment (Ubuntu + Nginx + MariaDB)

This deployment mirrors the observable shape of plasticbaazar.ir: Next.js is
served behind Nginx, application media uses a dedicated CDN hostname, and all
services can live on one Ubuntu VPS. The reference site's private backend and
database cannot be detected from the browser, so this project deliberately uses
Laravel with MariaDB/MySQL and does not require PostgreSQL.

## Required software

- Ubuntu VPS with at least 2 GB RAM
- Nginx
- PHP 8.4 FPM and extensions: `bcmath`, `curl`, `gd`, `intl`, `mbstring`,
  `mysql`, `xml`, `zip`
- Composer 2
- Node.js 24 LTS and npm
- MariaDB 11.8 LTS (or a compatible managed MySQL/MariaDB service)
- Certbot with the Nginx plugin

Cloudflare may manage DNS and proxy the three hostnames, but Cloudflare Pages
alone cannot run this Laravel/PHP application or MariaDB.

## Host names

- `example.com`: Next.js storefront
- `api.example.com`: Laravel API and Filament admin
- `cdn.example.com`: uploaded product images from Laravel public storage

Point all three DNS records to the VPS. Copy `environment.example` only to
`apps/api/.env`, and copy `web.environment.example` only to
`apps/web/.env.production`. Never expose `APP_KEY` or database credentials to
the Next.js process. Keep the real environment files only on the server.

## Database

Install the current MariaDB 11.8 LTS series from MariaDB's official repository
on Ubuntu 24.04:

```bash
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup \
  | sudo bash -s -- --mariadb-server-version="mariadb-11.8"
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo systemctl enable --now mariadb
sudo mariadb-secure-installation
```

Create separate runtime, migration, and backup users. Replace every example
password before executing this SQL:

```sql
CREATE DATABASE talaye_shalizar
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'talaye_app'@'localhost' IDENTIFIED BY 'LONG_RANDOM_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE
  ON talaye_shalizar.* TO 'talaye_app'@'localhost';

CREATE USER 'talaye_migrator'@'localhost' IDENTIFIED BY 'ANOTHER_LONG_RANDOM_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES,
      CREATE TEMPORARY TABLES, LOCK TABLES
  ON talaye_shalizar.* TO 'talaye_migrator'@'localhost';

CREATE USER 'talaye_backup'@'localhost' IDENTIFIED BY 'A_THIRD_LONG_RANDOM_PASSWORD';
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT
  ON talaye_shalizar.* TO 'talaye_backup'@'localhost';

FLUSH PRIVILEGES;
```

Use `DB_HOST=localhost` with these host-scoped accounts. Laravel must use
`DB_CONNECTION=mariadb`, `DB_ENGINE=InnoDB`, and `DB_TIMEZONE=+00:00`.
The permanent application `.env` contains only `talaye_app`; supply the
`talaye_migrator` credentials temporarily during a deployment and remove them
after migrations. SQLite remains convenient for fast local development; it is
not the production database.

Before provisioning the server, the repository provides a disposable local
MariaDB environment and full integration suite:

```powershell
powershell -ExecutionPolicy Bypass -File infra/mariadb/Initialize-MariaDb.ps1
powershell -ExecutionPolicy Bypass -File infra/mariadb/Test-MariaDb.ps1
```

## First release

From `/var/www/talaye-shalizar`:

```bash
composer install --working-dir=apps/api --no-dev --prefer-dist --optimize-autoloader
php apps/api/artisan key:generate
# Run this command with the temporary talaye_migrator credentials. The shared
# lock prevents a migration and backup from running at the same time.
sudo flock -x /run/lock/talaye-maintenance.lock -- \
  runuser -u www-data -- /usr/bin/php apps/api/artisan migrate --force
php apps/api/artisan storage:link
php apps/api/artisan optimize

npm ci
npm run build
cp -a apps/web/public/. apps/web/.next/standalone/apps/web/public/
mkdir -p apps/web/.next/standalone/apps/web/.next
cp -a apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
```

Copy `nginx.conf.example` to `/etc/nginx/sites-available/talaye-shalizar`, replace
the example domains, enable it, and validate it before reload:

```bash
sudo ln -s /etc/nginx/sites-available/talaye-shalizar /etc/nginx/sites-enabled/talaye-shalizar
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d example.com -d www.example.com -d api.example.com -d cdn.example.com
```

Install the web, queue, and scheduler units. The tmpfiles rule creates the
scheduler lock with the same ownership used by the backup service:

```bash
sudo cp deploy/production/talaye-web.service \
  deploy/production/talaye-queue.service \
  deploy/production/talaye-scheduler.service \
  deploy/production/talaye-scheduler.timer \
  /etc/systemd/system/
sudo cp deploy/production/talaye-tmpfiles.conf \
  /etc/tmpfiles.d/talaye-shalizar.conf
sudo systemd-tmpfiles --create /etc/tmpfiles.d/talaye-shalizar.conf
sudo systemctl daemon-reload
sudo systemctl enable --now talaye-web talaye-queue talaye-scheduler.timer
```

The queue worker continuously consumes `notifications`, `maintenance`, and
`default` in priority order. The systemd timer invokes `schedule:run` every
minute. Unpaid-order expiration runs every minute, abandoned carts every 15
minutes, and queue backlog monitoring every minute. Do not install a second
cron entry or run `schedule:work` on the same server.

Inspect queue and scheduler health with:

```bash
sudo systemctl --no-pager --full status talaye-queue talaye-scheduler.timer
sudo systemctl list-timers talaye-scheduler.timer
sudo journalctl -u talaye-queue -u talaye-scheduler.service --since today
php apps/api/artisan schedule:list
php apps/api/artisan queue:failed
```

Jobs retry automatically with bounded backoff. After correcting the underlying
problem, retry a specific permanently failed job with
`php apps/api/artisan queue:retry <uuid>`; use `queue:retry all` only after
checking that replaying every job is safe. Failed-job records are retained for
30 days by the scheduler.

Real OTP delivery also requires `SMS_DRIVER=kavenegar`, a valid
`KAVENEGAR_API_KEY`, and the two approved template names in the server `.env`.
Never commit the real API key. Until those values exist, use `SMS_DRIVER=log`
only for local development; it does not send a message to the customer.

## Backups

Copy the backup configuration and MariaDB client credentials to root-only
locations. Replace the example password first:

```bash
sudo install -d -m 0700 /etc/talaye-shalizar /var/backups/talaye-shalizar
sudo install -m 0600 deploy/production/backup.environment.example \
  /etc/talaye-shalizar/backup.env
sudo install -o root -g root -m 0600 deploy/production/mariadb-backup.cnf.example \
  /etc/mysql/talaye-backup.cnf
sudo install -o root -g root -m 0750 deploy/production/backup.sh \
  /usr/local/sbin/talaye-backup
sudo install -o root -g root -m 0750 deploy/production/backup-recover.sh \
  /usr/local/sbin/talaye-backup-recover
sudo cp deploy/production/talaye-backup.service deploy/production/talaye-backup.timer \
  /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now talaye-backup.timer
sudo systemctl start talaye-backup.service
sudo journalctl -u talaye-backup.service --no-pager
```

Each snapshot contains a transactional MariaDB dump, all files under
`apps/api/storage/app`, migration status, the Git commit, software versions,
and SHA-256 checksums. The root-owned backup launcher executes Laravel only as
`www-data`; it pauses and drains PHP-FPM, the queue, and scheduler so the
database and uploaded images belong to the same snapshot. Cleanup failures make
the systemd job fail instead of reporting a false success.
Copy completed snapshots to encrypted off-server storage; a backup
kept only on the VPS does not protect against disk or server loss. Perform a
restore rehearsal at least monthly.

Keep `APP_KEY` and `APP_PREVIOUS_KEYS` in a separate versioned secret manager;
never put their raw values inside normal data backups. The snapshot metadata
contains only the SHA-256 fingerprint needed to select the correct escrowed
key during recovery. Follow `RESTORE.md` for the recovery rehearsal.

## Release checks

```bash
curl -fsS https://api.example.com/up
curl -fsS https://api.example.com/api/v1/products
curl -I https://example.com
sudo systemctl --no-pager --full status talaye-web talaye-queue php8.4-fpm mariadb nginx
sudo systemctl --no-pager --full status talaye-scheduler.timer
```

Verify both the database and media files during release checks. Database dumps
alone do not contain uploaded product images.

After every release, restart long-lived workers so they load the new code:

```bash
php apps/api/artisan queue:restart
sudo systemctl restart talaye-queue
```
