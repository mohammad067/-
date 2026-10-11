<?php

namespace App\Models;

use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'product_id', 'product_variant_id', 'sku', 'product_name', 'variant_name', 'weight_grams', 'unit_price_rials', 'quantity', 'discount_rials', 'line_total_rials', 'metadata'])]
class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    protected function casts(): array
    {
        return [
            'weight_grams' => 'integer',
            'unit_price_rials' => 'integer',
            'quantity' => 'integer',
            'discount_rials' => 'integer',
            'line_total_rials' => 'integer',
            'metadata' => 'array',
        ];
    }
}
