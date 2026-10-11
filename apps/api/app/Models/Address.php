<?php

namespace App\Models;

use App\Models\Concerns\HasPublicId;
use Database\Factories\AddressFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'label', 'recipient_name', 'phone', 'province', 'city', 'postal_code', 'address_line', 'is_default', 'metadata'])]
class Address extends Model
{
    /** @use HasFactory<AddressFactory> */
    use HasFactory, HasPublicId, SoftDeletes;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'metadata' => 'array',
        ];
    }
}
