<?php

namespace App\Data\Cart;

use App\Models\Cart;

readonly class GuestCartCredentials
{
    public function __construct(
        public Cart $cart,
        public string $plainTextToken,
    ) {}
}
