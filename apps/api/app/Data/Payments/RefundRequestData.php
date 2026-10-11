<?php

namespace App\Data\Payments;

readonly class RefundRequestData
{
    public function __construct(
        public string $transactionId,
        public int $amountRials,
        public string $currency,
        public string $idempotencyKey,
    ) {}
}
