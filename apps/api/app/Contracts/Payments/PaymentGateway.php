<?php

namespace App\Contracts\Payments;

use App\Data\Payments\PaymentRequestData;
use App\Data\Payments\PaymentRequestResult;
use App\Data\Payments\PaymentVerificationData;
use App\Data\Payments\PaymentVerificationResult;
use App\Data\Payments\RefundRequestData;
use App\Data\Payments\RefundResult;

interface PaymentGateway
{
    public function name(): string;

    public function request(PaymentRequestData $request): PaymentRequestResult;

    public function verify(PaymentVerificationData $verification): PaymentVerificationResult;

    public function refund(RefundRequestData $refund): RefundResult;
}
