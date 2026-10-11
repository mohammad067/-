<?php

namespace App\Filament\Resources\ProductVariants\Pages;

use App\Actions\Inventory\AdjustInventory;
use App\Filament\Resources\ProductVariants\ProductVariantResource;
use App\Models\User;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditProductVariant extends EditRecord
{
    protected static string $resource = ProductVariantResource::class;

    protected int $stockOnHand = 0;

    /** @param array<string, mixed> $data @return array<string, mixed> */
    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['stock_on_hand'] = $this->record->inventoryItem?->on_hand ?? 0;

        return $data;
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->stockOnHand = (int) ($data['stock_on_hand'] ?? 0);
        unset($data['stock_on_hand']);

        return $data;
    }

    protected function afterSave(): void
    {
        $user = auth()->user();
        app(AdjustInventory::class)->handle($this->record, $this->stockOnHand, $user instanceof User ? $user : null);
    }

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
