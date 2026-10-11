<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $subtotalRials = $this->items->sum(
            fn ($item): int => $item->variant->price_rials * $item->quantity,
        );

        return [
            'id' => $this->public_id,
            'status' => $this->status->value,
            'currency' => $this->currency,
            'itemCount' => $this->items->sum('quantity'),
            'subtotalRials' => $subtotalRials,
            'items' => CartItemResource::collection($this->items),
            'expiresAt' => $this->expires_at?->toIso8601String(),
        ];
    }
}
