<?php

namespace App\Models;

use App\Enums\RefundStatus;
use App\Models\Concerns\HasPublicId;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['payment_id', 'requested_by', 'amount_rials', 'status', 'idempotency_key', 'gateway_refund_id', 'reason', 'requested_at', 'completed_at', 'failed_at', 'metadata'])]
class Refund extends Model
{
    use HasPublicId;

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    protected function casts(): array
    {
        return [
            'amount_rials' => 'integer',
            'status' => RefundStatus::class,
            'requested_at' => 'datetime',
            'completed_at' => 'datetime',
            'failed_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
