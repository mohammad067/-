<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Enums\ProductStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->label('دسته‌بندی')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),
                TextInput::make('name')
                    ->label('نام محصول')
                    ->maxLength(255)
                    ->required(),
                TextInput::make('slug')
                    ->label('اسلاگ')
                    ->unique(ignoreRecord: true)
                    ->maxLength(255)
                    ->required(),
                TextInput::make('short_description')
                    ->label('توضیح کوتاه')
                    ->maxLength(500),
                Textarea::make('description')
                    ->label('توضیحات')
                    ->rows(6)
                    ->columnSpanFull(),
                TextInput::make('origin_province')->label('استان مبدأ'),
                TextInput::make('origin_city')->label('شهر مبدأ'),
                TextInput::make('rice_variety')->label('رقم برنج'),
                TextInput::make('harvest_year')
                    ->label('سال برداشت')
                    ->numeric(),
                Select::make('status')
                    ->label('وضعیت')
                    ->options(ProductStatus::class)
                    ->default('draft')
                    ->required(),
                Toggle::make('is_featured')
                    ->label('محصول ویژه')
                    ->required(),
                DateTimePicker::make('published_at')->label('زمان انتشار'),
                KeyValue::make('metadata')
                    ->label('اطلاعات تکمیلی')
                    ->columnSpanFull(),
            ]);
    }
}
