<?php

namespace App\Filament\Resources\Shipments\Tables;

use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ShipmentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order.order_number')
                    ->label('شماره سفارش')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('وضعیت')
                    ->badge()
                    ->searchable(),
                TextColumn::make('carrier_name')
                    ->label('شرکت حمل')
                    ->searchable(),
                TextColumn::make('tracking_code')
                    ->label('کد رهگیری')
                    ->searchable(),
                TextColumn::make('handed_to_carrier_at')
                    ->label('زمان ارسال')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('delivered_at')
                    ->label('زمان تحویل')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
