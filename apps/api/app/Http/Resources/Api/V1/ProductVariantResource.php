<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $availableQuantity = $this->tracks_stock
            ? ($this->inventoryItem?->availableQuantity() ?? 0)
            : null;

        return [
            'id' => $this->public_id,
            'sku' => $this->sku,
            'title' => $this->title,
            'weightGrams' => $this->weight_grams,
            'priceRials' => $this->price_rials,
            'compareAtPriceRials' => $this->compare_at_price_rials,
            'tracksStock' => $this->tracks_stock,
            'allowsBackorder' => $this->allows_backorder,
            'availableQuantity' => $availableQuantity,
            'inStock' => ! $this->tracks_stock || $this->allows_backorder || $availableQuantity > 0,
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
