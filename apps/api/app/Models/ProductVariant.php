<?php

namespace App\Models;

use App\Enums\ProductStatus;
use App\Models\Concerns\HasPublicId;
use Database\Factories\ProductVariantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['product_id', 'sku', 'title', 'weight_grams', 'price_rials', 'compare_at_price_rials', 'cost_price_rials', 'position', 'status', 'tracks_stock', 'allows_backorder', 'low_stock_threshold'])]
class ProductVariant extends Model
{
    /** @use HasFactory<ProductVariantFactory> */
    use HasFactory, HasPublicId, SoftDeletes;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position')->orderBy('id');
    }

    public function inventoryItem(): HasOne
    {
        return $this->hasOne(InventoryItem::class);
    }

    protected function casts(): array
    {
        return [
            'weight_grams' => 'integer',
            'price_rials' => 'integer',
            'compare_at_price_rials' => 'integer',
            'cost_price_rials' => 'integer',
            'position' => 'integer',
            'status' => ProductStatus::class,
            'tracks_stock' => 'boolean',
            'allows_backorder' => 'boolean',
            'low_stock_threshold' => 'integer',
        ];
    }
}
