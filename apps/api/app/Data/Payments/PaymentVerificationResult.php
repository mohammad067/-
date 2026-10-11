<?php

namespace App\Data\Payments;

readonly class PaymentVerificationResult
{
    /** @param array<string, mixed> $metadata */
    public function __construct(
        public bool $successful,
        public ?string $transactionId = null,
        public ?string $failureCode = null,
        public ?string $failureMessage = null,
        public array $metadata = [],
    ) {}
}
