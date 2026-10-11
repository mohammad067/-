<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $variant = $this->variant;
        $product = $variant->product;
        $availableQuantity = $variant->tracks_stock
            ? ($variant->inventoryItem?->availableQuantity() ?? 0)
            : null;

        return [
            'variantId' => $variant->public_id,
            'sku' => $variant->sku,
            'title' => $variant->title,
            'weightGrams' => $variant->weight_grams,
            'quantity' => $this->quantity,
            'unitPriceRials' => $variant->price_rials,
            'lineTotalRials' => $variant->price_rials * $this->quantity,
            'availableQuantity' => $availableQuantity,
            'inStock' => ! $variant->tracks_stock || $variant->allows_backorder || $availableQuantity >= $this->quantity,
            'product' => [
                'id' => $product->public_id,
                'slug' => $product->slug,
                'name' => $product->name,
                'image' => ProductImageResource::make($product->images->first()),
            ],
        ];
    }
}
