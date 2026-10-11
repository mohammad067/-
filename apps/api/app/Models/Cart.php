<?php

namespace App\Models;

use App\Enums\CartStatus;
use App\Models\Concerns\HasPublicId;
use Database\Factories\CartFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['user_id', 'access_token_hash', 'status', 'currency', 'expires_at', 'last_activity_at', 'abandoned_at', 'recovered_at', 'reminder_sent_at'])]
#[Hidden(['access_token_hash'])]
class Cart extends Model
{
    /** @use HasFactory<CartFactory> */
    use HasFactory, HasPublicId;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }

    public function loadStorefrontDetails(): self
    {
        return $this->load([
            'items.variant.inventoryItem',
            'items.variant.product.images',
        ]);
    }

    protected function casts(): array
    {
        return [
            'status' => CartStatus::class,
            'expires_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'abandoned_at' => 'datetime',
            'recovered_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
        ];
    }
}
