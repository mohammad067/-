<?php

namespace App\Filament\Resources\ProductVariants\Pages;

use App\Actions\Inventory\AdjustInventory;
use App\Filament\Resources\ProductVariants\ProductVariantResource;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;

class CreateProductVariant extends CreateRecord
{
    protected static string $resource = ProductVariantResource::class;

    protected int $stockOnHand = 0;

    /** @param array<string, mixed> $data @return array<string, mixed> */
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->stockOnHand = (int) ($data['stock_on_hand'] ?? 0);
        unset($data['stock_on_hand']);

        return $data;
    }

    protected function afterCreate(): void
    {
        $user = auth()->user();
        app(AdjustInventory::class)->handle($this->record, $this->stockOnHand, $user instanceof User ? $user : null);
    }
}
