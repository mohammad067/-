<?php

use App\Jobs\ExpireUnpaidOrdersJob;
use App\Jobs\MarkAbandonedCartsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new MarkAbandonedCartsJob, 'maintenance')
    ->name('carts:mark-abandoned')
    ->everyFifteenMinutes()
    ->withoutOverlapping(10)
    ->onOneServer();

Schedule::job(new ExpireUnpaidOrdersJob, 'maintenance')
    ->name('orders:expire-unpaid')
    ->everyMinute()
    ->withoutOverlapping(10)
    ->onOneServer();

Schedule::command('queue:monitor database:maintenance,database:notifications,database:default --max=100')
    ->name('queue:monitor')
    ->everyMinute()
    ->withoutOverlapping(5)
    ->onOneServer();

Schedule::command('queue:prune-failed --hours=720')
    ->name('queue:prune-failed')
    ->dailyAt('04:00')
    ->withoutOverlapping(30)
    ->onOneServer();

Schedule::command('queue:prune-batches --hours=48 --unfinished=72 --cancelled=72')
    ->name('queue:prune-batches')
    ->dailyAt('04:15')
    ->withoutOverlapping(30)
    ->onOneServer();
