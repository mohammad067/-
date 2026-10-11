<?php

namespace App\Data\Payments;

readonly class PaymentRequestResult
{
    /** @param array<string, mixed> $metadata */
    public function __construct(
        public string $authority,
        public string $redirectUrl,
        public array $metadata = [],
    ) {}
}
