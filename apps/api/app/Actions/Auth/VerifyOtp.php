<?php

namespace App\Actions\Auth;

use App\Models\OtpChallenge;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class VerifyOtp
{
    public function handle(string $phone, string $purpose, string $code): OtpChallenge
    {
        return DB::transaction(function () use ($phone, $purpose, $code): OtpChallenge {
            $challenge = OtpChallenge::query()
                ->where('phone', $phone)
                ->where('purpose', $purpose)
                ->latest('id')
                ->lockForUpdate()
                ->first();

            if ($challenge === null || ! $challenge->isUsable() || ! Hash::check($code, $challenge->code_hash)) {
                if ($challenge?->isUsable()) {
                    $challenge->increment('attempts');
                }
                throw ValidationException::withMessages(['code' => 'کد تأیید نامعتبر یا منقضی شده است.']);
            }

            $challenge->update(['consumed_at' => now()]);

            return $challenge;
        });
    }
}
