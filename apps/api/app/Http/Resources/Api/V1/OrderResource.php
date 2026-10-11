<?php

namespace App\Http\Resources\Api\V1;

use App\Enums\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'orderNumber' => $this->order_number,
            'status' => $this->status->value,
            'paymentStatus' => $this->payment_status->value,
            'currency' => $this->currency,
            'customer' => [
                'phone' => $this->customer_phone,
                'email' => $this->customer_email,
            ],
            'totals' => [
                'subtotalRials' => $this->subtotal_rials,
                'discountRials' => $this->discount_rials,
                'shippingRials' => $this->shipping_rials,
                'taxRials' => $this->tax_rials,
                'totalRials' => $this->total_rials,
            ],
            'shippingMethod' => [
                'code' => $this->shipping_method_code,
                'name' => $this->shipping_method_name,
            ],
            'shippingAddress' => OrderAddressResource::make(
                $this->whenLoaded('addresses', fn () => $this->addresses->firstWhere('type', 'shipping')),
            ),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'customerNote' => $this->customer_note,
            'canPay' => $this->status === OrderStatus::PendingPayment
                && ($this->expires_at === null || $this->expires_at->isFuture()),
            'placedAt' => $this->placed_at?->toIso8601String(),
            'expiresAt' => $this->expires_at?->toIso8601String(),
        ];
    }
}
