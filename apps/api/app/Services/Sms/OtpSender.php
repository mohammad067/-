<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class OtpSender
{
    public function send(string $phone, string $code, string $purpose): void
    {
        if (config('services.sms.driver') === 'log') {
            Log::info('Development OTP', ['phone' => $phone, 'code' => $code, 'purpose' => $purpose]);

            return;
        }

        if (config('services.sms.driver') !== 'kavenegar') {
            throw new RuntimeException('Unsupported SMS driver.');
        }

        $apiKey = config('services.sms.kavenegar.api_key');
        $template = $purpose === 'password_reset'
            ? config('services.sms.kavenegar.password_reset_template')
            : config('services.sms.kavenegar.verification_template');

        if (! is_string($apiKey) || $apiKey === '' || ! is_string($template) || $template === '') {
            throw new RuntimeException('Kavenegar credentials are not configured.');
        }

        Http::asForm()
            ->timeout(10)
            ->retry(2, 250)
            ->post("https://api.kavenegar.com/v1/{$apiKey}/verify/lookup.json", [
                'receptor' => $phone,
                'token' => $code,
                'template' => $template,
            ])
            ->throw();
    }
}
