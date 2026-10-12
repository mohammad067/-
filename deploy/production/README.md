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

Point all three DNS records to the VPS. Copy `environment.example` values into
`apps/api/.env` and `apps/web/.env.production`, replacing every example value.
Keep the real environment files only on the server.

## Database

Create a database and a least-privilege application user:

```sql
CREATE DATABASE talaye_shalizar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'talaye_app'@'localhost' IDENTIFIED BY 'LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON talaye_shalizar.* TO 'talaye_app'@'localhost';
FLUSH PRIVILEGES;
```

Laravel must use `DB_CONNECTION=mariadb`. SQLite remains convenient for local
development and tests; it is not the production database.

## First release

From `/var/www/talaye-shalizar`:

```bash
composer install --working-dir=apps/api --no-dev --prefer-dist --optimize-autoloader
php apps/api/artisan key:generate
php apps/api/artisan migrate --force
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

Copy both systemd unit files to `/etc/systemd/system/`, then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now talaye-web talaye-queue
```

Run Laravel's scheduler every minute:

```cron
* * * * * cd /var/www/talaye-shalizar/apps/api && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
```

## Release checks

```bash
curl -fsS https://api.example.com/up
curl -fsS https://api.example.com/api/v1/products
curl -I https://example.com
sudo systemctl --no-pager --full status talaye-web talaye-queue php8.4-fpm mariadb nginx
```

Back up both the MariaDB database and `apps/api/storage/app/public`. Database
backups alone do not include uploaded product images.
