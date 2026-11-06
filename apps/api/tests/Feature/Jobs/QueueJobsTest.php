<?php

namespace Tests\Feature\Jobs;

use App\Actions\Auth\IssueOtp;
use App\Actions\Cart\MarkAbandonedCarts;
use App\Actions\Orders\ExpireUnpaidOrders;
use App\Jobs\ExpireUnpaidOrdersJob;
use App\Jobs\MarkAbandonedCartsJob;
use App\Jobs\SendOtpSmsJob;
use App\Models\OtpChallenge;
use App\Models\User;
use App\Services\Sms\OtpSender;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use RuntimeException;
use Tests\TestCase;

class QueueJobsTest extends TestCase
{
    use RefreshDatabase;

    public function test_issuing_an_otp_dispatches_an_encrypted_notification_job(): void
    {
        Queue::fake();
        $user = User::factory()->create();

        app(IssueOtp::class)->handle(
            $user->phone,
            'phone_verification',
            $user,
            '127.0.0.1',
        );

        $challenge = OtpChallenge::query()->sole();

        Queue::assertPushedOn(
            'notifications',
            SendOtpSmsJob::class,
            fn (SendOtpSmsJob $job): bool => $job->challengeId === $challenge->id
                && $job instanceof ShouldBeEncrypted,
        );
    }

    public function test_the_database_queue_payload_does_not_contain_the_plain_otp(): void
    {
        config()->set('queue.connections.database.after_commit', false);

        Queue::connection('database')->push(
            new SendOtpSmsJob(123, '654321'),
            queue: 'notifications',
        );

        $payload = (string) DB::table('jobs')->value('payload');

        $this->assertStringNotContainsString('654321', $payload);
    }

    public function test_otp_job_sends_only_a_current_usable_challenge(): void
    {
        config()->set('services.sms.driver', 'kavenegar');
        config()->set('services.sms.kavenegar.api_key', 'test-api-key');
        config()->set('services.sms.kavenegar.verification_template', 'verify');

        Http::fake([
            'api.kavenegar.com/*' => Http::response(['return' => ['status' => 200]], 200),
        ]);

        $challenge = $this->createChallenge();
        $job = new SendOtpSmsJob($challenge->id, '123456');
        $job->handle(app(OtpSender::class));

        Http::assertSentCount(1);

        $challenge->update(['consumed_at' => now()]);
        $job->handle(app(OtpSender::class));

        Http::assertSentCount(1);
    }

    public function test_final_otp_job_failure_invalidates_the_challenge(): void
    {
        $challenge = $this->createChallenge();
        $job = new SendOtpSmsJob($challenge->id, '123456');

        $job->failed(new RuntimeException('provider unavailable'));

        $this->assertNotNull($challenge->fresh()->consumed_at);
    }

    public function test_maintenance_jobs_are_unique_and_use_the_maintenance_queue(): void
    {
        $orders = new ExpireUnpaidOrdersJob;
        $carts = new MarkAbandonedCartsJob;

        $this->assertInstanceOf(ShouldBeUnique::class, $orders);
        $this->assertInstanceOf(ShouldBeUnique::class, $carts);
        $this->assertSame('maintenance', $orders->queue);
        $this->assertSame('maintenance', $carts->queue);
        $this->assertSame('orders:expire-unpaid', $orders->uniqueId());
        $this->assertSame('carts:mark-abandoned', $carts->uniqueId());
    }

    public function test_maintenance_jobs_delegate_to_their_domain_actions(): void
    {
        $orders = $this->mock(ExpireUnpaidOrders::class);
        $orders->shouldReceive('handle')->once()->andReturn(0);

        $carts = $this->mock(MarkAbandonedCarts::class);
        $carts->shouldReceive('handle')->once()->andReturn(0);

        (new ExpireUnpaidOrdersJob)->handle($orders);
        (new MarkAbandonedCartsJob)->handle($carts);
    }

    public function test_scheduler_contains_queue_and_maintenance_tasks(): void
    {
        $scheduledTasks = collect(app(Schedule::class)->events())
            ->pluck('description')
            ->filter()
            ->all();

        $this->assertContains('orders:expire-unpaid', $scheduledTasks);
        $this->assertContains('carts:mark-abandoned', $scheduledTasks);
        $this->assertContains('queue:monitor', $scheduledTasks);
        $this->assertContains('queue:prune-failed', $scheduledTasks);
    }

    private function createChallenge(): OtpChallenge
    {
        return OtpChallenge::query()->create([
            'phone' => '09121234567',
            'purpose' => 'phone_verification',
            'code_hash' => Hash::make('123456'),
            'expires_at' => now()->addMinutes(5),
        ]);
    }
}
