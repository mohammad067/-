<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'slug' => $this->slug,
            'name' => $this->name,
            'summary' => $this->short_description,
            'description' => $this->description,
            'origin' => [
                'province' => $this->origin_province,
                'city' => $this->origin_city,
            ],
            'variety' => $this->rice_variety,
            'harvestYear' => $this->harvest_year,
            'featured' => $this->is_featured,
            'rating' => (float) data_get($this->metadata, 'rating', 0),
            'reviewsCount' => (int) data_get($this->metadata, 'reviews_count', 0),
            'aromaScore' => (float) data_get($this->metadata, 'aroma_score', 0),
            'lengthScore' => (float) data_get($this->metadata, 'length_score', 0),
            'category' => $this->whenLoaded('category', fn (): ?array => $this->category === null ? null : [
                'id' => $this->category->public_id,
                'slug' => $this->category->slug,
                'name' => $this->category->name,
            ]),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'publishedAt' => $this->published_at?->toIso8601String(),
        ];
    }
}
