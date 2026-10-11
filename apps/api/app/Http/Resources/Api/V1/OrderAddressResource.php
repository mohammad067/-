<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderAddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'recipientName' => $this->recipient_name,
            'phone' => $this->phone,
            'province' => $this->province,
            'city' => $this->city,
            'postalCode' => $this->postal_code,
            'addressLine' => $this->address_line,
        ];
    }
}
