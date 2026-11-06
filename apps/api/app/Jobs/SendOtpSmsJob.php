<?php

namespace App\Jobs;

use App\Models\OtpChallenge;
use App\Services\Sms\OtpSender;
use DateTimeInterface;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SendOtpSmsJob implements ShouldBeEncrypted, ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $maxExceptions = 3;

    public int $timeout = 30;

    public bool $failOnTimeout = true;

    public function __construct(
        public readonly int $challengeId,
        private readonly string $code,
    ) {
        $this->onQueue('notifications');
    }

    /** @return list<int> */
    public function backoff(): array
    {
        return [10, 30, 90, 180];
    }

    public function retryUntil(): DateTimeInterface
    {
        return now()->addMinutes(5);
    }

    public function handle(OtpSender $sender): void
    {
        $challenge = OtpChallenge::query()->find($this->challengeId);

        if ($challenge === null || ! $challenge->isUsable()) {
            return;
        }

        $sender->send($challenge->phone, $this->code, $challenge->purpose);
    }

    public function failed(?Throwable $exception): void
    {
        OtpChallenge::query()
            ->whereKey($this->challengeId)
            ->whereNull('consumed_at')
            ->update(['consumed_at' => now()]);

        Log::error('OTP SMS delivery permanently failed.', [
            'challenge_id' => $this->challengeId,
            'exception_class' => $exception === null ? null : $exception::class,
        ]);
    }
}
