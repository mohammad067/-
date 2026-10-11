<?php

namespace App\Actions\Orders;

use App\Models\Order;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ResolveGuestOrder
{
    public function handle(string $publicId, ?string $plainTextToken): Order
    {
        if ($plainTextToken === null || $plainTextToken === '') {
            throw (new ModelNotFoundException)->setModel(Order::class);
        }

        return Order::query()
            ->where('public_id', $publicId)
            ->where('access_token_hash', hash('sha256', $plainTextToken))
            ->firstOrFail()
            ->loadGuestDetails();
    }
}
