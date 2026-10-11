<?php

namespace App\Filament\Resources\Payments\Tables;

use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order.order_number')
                    ->label('شماره سفارش')
                    ->searchable(),
                TextColumn::make('gateway')
                    ->label('درگاه')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('وضعیت')
                    ->badge()
                    ->searchable(),
                TextColumn::make('amount_rials')
                    ->label('مبلغ (ریال)')
                    ->money('IRR')
                    ->sortable(),
                TextColumn::make('authority')
                    ->label('Authority')
                    ->searchable(),
                TextColumn::make('gateway_transaction_id')
                    ->label('شناسه تراکنش')
                    ->searchable(),
                TextColumn::make('failure_code')
                    ->label('کد خطا')
                    ->searchable(),
                TextColumn::make('requested_at')
                    ->label('زمان درخواست')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('paid_at')
                    ->label('زمان پرداخت')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
