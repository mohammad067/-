<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sku' => $this->sku,
            'productName' => $this->product_name,
            'variantName' => $this->variant_name,
            'weightGrams' => $this->weight_grams,
            'unitPriceRials' => $this->unit_price_rials,
            'quantity' => $this->quantity,
            'discountRials' => $this->discount_rials,
            'lineTotalRials' => $this->line_total_rials,
        ];
    }
}
