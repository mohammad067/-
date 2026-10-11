<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'label' => $this->label,
            'recipientName' => $this->recipient_name,
            'phone' => $this->phone,
            'province' => $this->province,
            'city' => $this->city,
            'postalCode' => $this->postal_code,
            'addressLine' => $this->address_line,
            'isDefault' => $this->is_default,
        ];
    }
}
