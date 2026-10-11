<?php

namespace App\Actions\Auth;

use App\Models\OtpChallenge;
use App\Models\User;
use App\Services\Sms\OtpSender;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class IssueOtp
{
    public function __construct(private OtpSender $sender) {}

    public function handle(string $phone, string $purpose, ?User $user, ?string $ip): void
    {
        $code = (string) random_int(100000, 999999);

        $challenge = DB::transaction(function () use ($phone, $purpose, $user, $ip, $code): OtpChallenge {
            OtpChallenge::query()
                ->where('phone', $phone)
                ->where('purpose', $purpose)
                ->whereNull('consumed_at')
                ->update(['consumed_at' => now()]);

            return OtpChallenge::query()->create([
                'user_id' => $user?->id,
                'phone' => $phone,
                'purpose' => $purpose,
                'code_hash' => Hash::make($code),
                'request_ip_hash' => $ip ? hash_hmac('sha256', $ip, (string) config('app.key')) : null,
                'expires_at' => now()->addMinutes(5),
            ]);
        });

        try {
            $this->sender->send($phone, $code, $purpose);
        } catch (Throwable $exception) {
            $challenge->forceFill(['consumed_at' => now()])->save();

            throw $exception;
        }
    }
}
