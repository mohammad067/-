<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Models\Concerns\HasPublicId;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['order_id', 'gateway', 'status', 'amount_rials', 'currency', 'idempotency_key', 'authority', 'gateway_transaction_id', 'redirect_url', 'failure_code', 'failure_message', 'requested_at', 'verified_at', 'paid_at', 'failed_at', 'cancelled_at', 'metadata'])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory, HasPublicId;

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class);
    }

    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'amount_rials' => 'integer',
            'requested_at' => 'datetime',
            'verified_at' => 'datetime',
            'paid_at' => 'datetime',
            'failed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
