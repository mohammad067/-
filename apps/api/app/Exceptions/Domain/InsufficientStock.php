<?php

namespace App\Exceptions\Domain;

use RuntimeException;

class InsufficientStock extends RuntimeException
{
    public function __construct(
        public readonly string $variantPublicId,
        public readonly int $requestedQuantity,
        public readonly int $availableQuantity,
    ) {
        parent::__construct("Insufficient stock for variant {$variantPublicId}.");
    }
}
