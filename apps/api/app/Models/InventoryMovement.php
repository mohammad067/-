<?php

namespace App\Models;

use App\Enums\InventoryMovementType;
use App\Models\Concerns\HasPublicId;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_variant_id', 'actor_id', 'type', 'on_hand_delta', 'reserved_delta', 'balance_on_hand', 'balance_reserved', 'idempotency_key', 'reference_type', 'reference_id', 'metadata'])]
class InventoryMovement extends Model
{
    use HasPublicId;

    public const UPDATED_AT = null;

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    protected function casts(): array
    {
        return [
            'type' => InventoryMovementType::class,
            'on_hand_delta' => 'integer',
            'reserved_delta' => 'integer',
            'balance_on_hand' => 'integer',
            'balance_reserved' => 'integer',
            'metadata' => 'array',
        ];
    }
}
