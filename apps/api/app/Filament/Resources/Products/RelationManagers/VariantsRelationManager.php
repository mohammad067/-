<?php

namespace App\Filament\Resources\Products\RelationManagers;

use App\Filament\Resources\ProductVariants\ProductVariantResource;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';

    protected static ?string $relatedResource = ProductVariantResource::class;

    protected static ?string $title = 'واریانت‌ها، قیمت و موجودی';

    public function table(Table $table): Table
    {
        return $table;
    }
}
