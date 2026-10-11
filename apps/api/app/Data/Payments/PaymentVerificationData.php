<?php

namespace App\Data\Payments;

readonly class PaymentVerificationData
{
    public function __construct(
        public string $authority,
        public int $amountRials,
        public string $currency,
    ) {}
}
