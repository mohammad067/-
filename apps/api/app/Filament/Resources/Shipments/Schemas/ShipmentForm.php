<?php

namespace App\Filament\Resources\Shipments\Schemas;

use App\Enums\ShipmentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ShipmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('order_id')
                    ->label('سفارش')
                    ->relationship('order', 'order_number')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('status')
                    ->label('وضعیت ارسال')
                    ->options(ShipmentStatus::class)
                    ->default('pending')
                    ->required(),
                TextInput::make('carrier_code')->label('کد شرکت حمل'),
                TextInput::make('carrier_name')->label('شرکت حمل'),
                TextInput::make('tracking_code')->label('کد رهگیری'),
                DateTimePicker::make('handed_to_carrier_at')->label('تحویل به شرکت حمل'),
                DateTimePicker::make('delivered_at')->label('زمان تحویل'),
                DateTimePicker::make('returned_at')->label('زمان مرجوعی'),
                KeyValue::make('metadata')
                    ->label('اطلاعات تکمیلی')
                    ->columnSpanFull(),
            ]);
    }
}
