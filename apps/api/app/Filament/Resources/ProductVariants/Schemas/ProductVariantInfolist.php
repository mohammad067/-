<?php

namespace App\Filament\Resources\ProductVariants\Schemas;

use App\Models\ProductVariant;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductVariantInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('public_id'),
                TextEntry::make('product.name')
                    ->label('Product'),
                TextEntry::make('sku')
                    ->label('SKU'),
                TextEntry::make('title'),
                TextEntry::make('weight_grams')
                    ->numeric(),
                TextEntry::make('price_rials')
                    ->numeric(),
                TextEntry::make('compare_at_price_rials')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('cost_price_rials')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('position')
                    ->numeric(),
                TextEntry::make('status')
                    ->badge(),
                IconEntry::make('tracks_stock')
                    ->boolean(),
                IconEntry::make('allows_backorder')
                    ->boolean(),
                TextEntry::make('low_stock_threshold')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('deleted_at')
                    ->dateTime()
                    ->visible(fn (ProductVariant $record): bool => $record->trashed()),
            ]);
    }
}
