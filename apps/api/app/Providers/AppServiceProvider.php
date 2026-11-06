<?php

namespace App\Providers;

use App\Models\ProductImage;
use App\Observers\ProductImageObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\QueueBusy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.force_https')) {
            URL::forceScheme('https');
        }

        Model::preventLazyLoading(! $this->app->isProduction());
        ProductImage::observe(ProductImageObserver::class);

        Queue::failing(function (JobFailed $event): void {
            Log::critical('A queued job permanently failed.', [
                'connection' => $event->connectionName,
                'queue' => $event->job->getQueue(),
                'job_id' => $event->job->getJobId(),
                'job_name' => $event->job->resolveName(),
                'attempts' => $event->job->attempts(),
                'exception_class' => $event->exception::class,
            ]);
        });

        Event::listen(function (QueueBusy $event): void {
            Log::warning('Queue backlog exceeded its configured threshold.', [
                'connection' => $event->connectionName,
                'queue' => $event->queue,
                'size' => $event->size,
            ]);
        });
    }
}
