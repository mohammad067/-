<?php

namespace App\Models;

use App\Models\Concerns\HasPublicId;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['gateway', 'event_id', 'payload_hash', 'headers', 'payload', 'signature_hash', 'status', 'error_message', 'received_at', 'processed_at'])]
#[Hidden(['payload', 'signature_hash'])]
class PaymentWebhookEvent extends Model
{
    use HasPublicId;

    protected function casts(): array
    {
        return [
            'headers' => 'array',
            'payload' => 'encrypted:array',
            'received_at' => 'datetime',
            'processed_at' => 'datetime',
        ];
    }
}
