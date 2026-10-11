<?php

namespace App\Actions\Inventory;

use App\Enums\InventoryMovementType;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\ProductVariant;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdjustInventory
{
    public function handle(ProductVariant $variant, int $onHand, ?User $actor): InventoryItem
    {
        if ($onHand < 0) {
            throw new DomainException('Inventory cannot be negative.');
        }

        return DB::transaction(function () use ($variant, $onHand, $actor): InventoryItem {
            $inventoryItem = InventoryItem::query()
                ->where('product_variant_id', $variant->id)
                ->lockForUpdate()
                ->first();

            $inventoryItem ??= new InventoryItem([
                'product_variant_id' => $variant->id,
                'on_hand' => 0,
                'reserved' => 0,
            ]);

            if ($onHand < $inventoryItem->reserved) {
                throw new DomainException('Inventory cannot be lower than the reserved quantity.');
            }

            $delta = $onHand - $inventoryItem->on_hand;
            $inventoryItem->on_hand = $onHand;
            $inventoryItem->save();

            if ($delta !== 0) {
                InventoryMovement::query()->create([
                    'product_variant_id' => $variant->id,
                    'actor_id' => $actor?->id,
                    'type' => InventoryMovementType::Correction,
                    'on_hand_delta' => $delta,
                    'reserved_delta' => 0,
                    'balance_on_hand' => $inventoryItem->on_hand,
                    'balance_reserved' => $inventoryItem->reserved,
                    'idempotency_key' => hash('sha256', 'admin-stock:'.Str::uuid()),
                    'reference_type' => 'admin',
                    'reference_id' => $actor?->public_id,
                ]);
            }

            return $inventoryItem;
        }, attempts: 3);
    }
}
