<?php

namespace App\Data\Payments;

readonly class PaymentRequestData
{
    public function __construct(
        public int $amountRials,
        public string $currency,
        public string $callbackUrl,
        public string $orderNumber,
        public ?string $customerPhone = null,
    ) {}
}
