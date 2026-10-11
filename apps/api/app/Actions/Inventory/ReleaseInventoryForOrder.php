<?php

namespace App\Actions\Inventory;

use App\Enums\InventoryMovementType;
use App\Enums\InventoryReservationStatus;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\Order;
use DomainException;
use Illuminate\Support\Facades\DB;

class ReleaseInventoryForOrder
{
    public function handle(
        Order $order,
        InventoryReservationStatus $finalStatus = InventoryReservationStatus::Released,
    ): void {
        if (! in_array($finalStatus, [InventoryReservationStatus::Released, InventoryReservationStatus::Expired], true)) {
            throw new DomainException('An inventory reservation may only be released or expired.');
        }

        DB::transaction(function () use ($order, $finalStatus): void {
            $reservations = $order->inventoryReservations()
                ->where('status', InventoryReservationStatus::Active->value)
                ->orderBy('product_variant_id')
                ->lockForUpdate()
                ->get();

            foreach ($reservations as $reservation) {
                $inventoryItem = InventoryItem::query()
                    ->where('product_variant_id', $reservation->product_variant_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($inventoryItem->reserved < $reservation->quantity) {
                    throw new DomainException('Reserved inventory cannot become negative.');
                }

                $inventoryItem->reserved -= $reservation->quantity;
                $inventoryItem->save();

                InventoryMovement::query()->create([
                    'product_variant_id' => $reservation->product_variant_id,
                    'type' => InventoryMovementType::ReservationRelease,
                    'on_hand_delta' => 0,
                    'reserved_delta' => -$reservation->quantity,
                    'balance_on_hand' => $inventoryItem->on_hand,
                    'balance_reserved' => $inventoryItem->reserved,
                    'idempotency_key' => hash('sha256', "release:{$reservation->idempotency_key}"),
                    'reference_type' => 'order',
                    'reference_id' => $order->public_id,
                    'metadata' => ['final_status' => $finalStatus->value],
                ]);

                $reservation->update([
                    'status' => $finalStatus,
                    'released_at' => now(),
                ]);
            }
        }, attempts: 3);
    }
}
