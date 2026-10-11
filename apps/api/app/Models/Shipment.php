<?php

namespace App\Models;

use App\Enums\ShipmentStatus;
use App\Models\Concerns\HasPublicId;
use Database\Factories\ShipmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'status', 'carrier_code', 'carrier_name', 'tracking_code', 'handed_to_carrier_at', 'delivered_at', 'returned_at', 'metadata'])]
class Shipment extends Model
{
    /** @use HasFactory<ShipmentFactory> */
    use HasFactory, HasPublicId;

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    protected function casts(): array
    {
        return [
            'status' => ShipmentStatus::class,
            'handed_to_carrier_at' => 'datetime',
            'delivered_at' => 'datetime',
            'returned_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
