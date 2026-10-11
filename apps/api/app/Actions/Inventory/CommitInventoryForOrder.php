<?php

namespace App\Actions\Inventory;

use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Exceptions\Domain\InsufficientStock;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class CommitInventoryForOrder
{
    public function handle(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $reservations = $order->inventoryReservations()
                ->where('status', InventoryReservationStatus::Active->value)
                ->with('variant')
                ->orderBy('product_variant_id')
                ->lockForUpdate()
                ->get();

            foreach ($reservations as $reservation) {
                $inventoryItem = InventoryItem::query()
                    ->where('product_variant_id', $reservation->product_variant_id)
                    ->lockForUpdate()
                    ->first();

                if ($inventoryItem === null
                    || $inventoryItem->on_hand < $reservation->quantity
                    || $inventoryItem->reserved < $reservation->quantity) {
                    throw new InsufficientStock(
                        $reservation->variant->public_id,
                        $reservation->quantity,
                        $inventoryItem?->availableQuantity() ?? 0,
                    );
                }

                $inventoryItem->on_hand -= $reservation->quantity;
                $inventoryItem->reserved -= $reservation->quantity;
                $inventoryItem->save();

                InventoryMovement::query()->create([
                    'product_variant_id' => $reservation->product_variant_id,
                    'type' => InventoryMovementType::Sale,
                    'on_hand_delta' => -$reservation->quantity,
                    'reserved_delta' => -$reservation->quantity,
                    'balance_on_hand' => $inventoryItem->on_hand,
                    'balance_reserved' => $inventoryItem->reserved,
                    'idempotency_key' => hash('sha256', "commit:{$reservation->idempotency_key}"),
                    'reference_type' => 'order',
                    'reference_id' => $order->public_id,
                ]);

                $reservation->update([
                    'status' => InventoryReservationStatus::Committed,
                    'committed_at' => now(),
                ]);
            }
        }, attempts: 3);
    }
}
