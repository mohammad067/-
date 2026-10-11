<?php

namespace App\Data\Orders;

use App\Models\Order;

readonly class GuestOrderResult
{
    public function __construct(
        public Order $order,
        public string $plainTextToken,
        public bool $created,
    ) {}
}
