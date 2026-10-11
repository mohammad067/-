<?php

namespace App\Data\Payments;

readonly class RefundResult
{
    /** @param array<string, mixed> $metadata */
    public function __construct(
        public bool $successful,
        public ?string $gatewayRefundId = null,
        public ?string $failureCode = null,
        public ?string $failureMessage = null,
        public array $metadata = [],
    ) {}
}
