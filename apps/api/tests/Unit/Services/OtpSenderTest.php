<?php

namespace Tests\Unit\Services;

use App\Services\Sms\OtpSender;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class OtpSenderTest extends TestCase
{
    public function test_it_sends_verification_code_through_kavenegar_lookup_api(): void
    {
        config()->set('services.sms.driver', 'kavenegar');
        config()->set('services.sms.kavenegar.api_key', 'test-api-key');
        config()->set('services.sms.kavenegar.verification_template', 'verify');

        Http::fake([
            'api.kavenegar.com/*' => Http::response(['return' => ['status' => 200]], 200),
        ]);

        app(OtpSender::class)->send('09121234567', '123456', 'phone_verification');

        Http::assertSent(fn (Request $request): bool => $request->url() === 'https://api.kavenegar.com/v1/test-api-key/verify/lookup.json'
            && $request['receptor'] === '09121234567'
            && $request['token'] === '123456'
            && $request['template'] === 'verify'
        );
    }

    public function test_it_rejects_kavenegar_driver_without_credentials(): void
    {
        config()->set('services.sms.driver', 'kavenegar');
        config()->set('services.sms.kavenegar.api_key', '');

        $this->expectException(RuntimeException::class);

        app(OtpSender::class)->send('09121234567', '123456', 'phone_verification');
    }
}
