<?php

namespace App\Filament\Resources\ProductVariants\Schemas;

use App\Enums\ProductStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductVariantForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('product_id')
                    ->label('محصول')
                    ->relationship('product', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->unique(ignoreRecord: true)
                    ->required(),
                TextInput::make('title')
                    ->label('عنوان واریانت')
                    ->required(),
                TextInput::make('weight_grams')
                    ->label('وزن (گرم)')
                    ->required()
                    ->numeric(),
                TextInput::make('price_rials')
                    ->label('قیمت فروش (ریال)')
                    ->required()
                    ->numeric(),
                TextInput::make('compare_at_price_rials')
                    ->label('قیمت قبل از تخفیف (ریال)')
                    ->numeric(),
                TextInput::make('cost_price_rials')
                    ->label('قیمت تمام‌شده (ریال)')
                    ->numeric(),
                TextInput::make('stock_on_hand')
                    ->label('موجودی فیزیکی')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->default(0),
                TextInput::make('position')
                    ->label('ترتیب نمایش')
                    ->required()
                    ->numeric()
                    ->default(0),
                Select::make('status')
                    ->label('وضعیت')
                    ->options(ProductStatus::class)
                    ->default('active')
                    ->required(),
                Toggle::make('tracks_stock')
                    ->label('کنترل موجودی')
                    ->required(),
                Toggle::make('allows_backorder')
                    ->label('اجازه پیش‌فروش')
                    ->required(),
                TextInput::make('low_stock_threshold')
                    ->label('هشدار کمبود موجودی')
                    ->required()
                    ->numeric()
                    ->default(5),
            ]);
    }
}
