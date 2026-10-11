<?php

namespace App\Actions\Inventory;

use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Exceptions\Domain\InsufficientStock;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ReserveInventoryForOrder
{
    /** @return Collection<int, InventoryReservation> */
    public function handle(Order $order): Collection
    {
        return DB::transaction(function () use ($order): Collection {
            $orderItems = $order->items()
                ->whereNotNull('product_variant_id')
                ->with('variant')
                ->orderBy('product_variant_id')
                ->get();

            foreach ($orderItems as $orderItem) {
                $variant = $orderItem->variant;

                if (! $variant instanceof ProductVariant || ! $variant->tracks_stock) {
                    continue;
                }

                $existingReservation = InventoryReservation::query()
                    ->whereBelongsTo($order)
                    ->whereBelongsTo($variant, 'variant')
                    ->first();

                if ($existingReservation !== null) {
                    continue;
                }

                $inventoryItem = InventoryItem::query()
                    ->whereBelongsTo($variant, 'variant')
                    ->lockForUpdate()
                    ->first();

                $availableQuantity = $inventoryItem?->availableQuantity() ?? 0;

                if ($inventoryItem === null || $availableQuantity < $orderItem->quantity) {
                    throw new InsufficientStock(
                        $variant->public_id,
                        $orderItem->quantity,
                        $availableQuantity,
                    );
                }

                $inventoryItem->reserved += $orderItem->quantity;
                $inventoryItem->save();

                $idempotencyKey = hash('sha256', "reserve:{$order->public_id}:{$variant->public_id}");

                InventoryReservation::query()->create([
                    'order_id' => $order->id,
                    'product_variant_id' => $variant->id,
                    'quantity' => $orderItem->quantity,
                    'status' => InventoryReservationStatus::Active,
                    'idempotency_key' => $idempotencyKey,
                    'expires_at' => $order->expires_at ?? now()->addMinutes(20),
                ]);

                InventoryMovement::query()->create([
                    'product_variant_id' => $variant->id,
                    'type' => InventoryMovementType::Reservation,
                    'on_hand_delta' => 0,
                    'reserved_delta' => $orderItem->quantity,
                    'balance_on_hand' => $inventoryItem->on_hand,
                    'balance_reserved' => $inventoryItem->reserved,
                    'idempotency_key' => $idempotencyKey,
                    'reference_type' => 'order',
                    'reference_id' => $order->public_id,
                ]);
            }

            return $order->inventoryReservations()->get();
        }, attempts: 3);
    }
}
