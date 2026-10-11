<?php

namespace App\Filament\Resources\Refunds\Tables;

use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RefundsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('payment.order.order_number')
                    ->label('شماره سفارش')
                    ->searchable(),
                TextColumn::make('requester.name')
                    ->label('ثبت‌کننده'),
                TextColumn::make('amount_rials')
                    ->label('مبلغ (ریال)')
                    ->money('IRR')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('وضعیت')
                    ->badge()
                    ->searchable(),
                TextColumn::make('gateway_refund_id')
                    ->label('شناسه درگاه')
                    ->searchable(),
                TextColumn::make('requested_at')
                    ->label('زمان درخواست')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('completed_at')
                    ->label('زمان تکمیل')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->defaultSort('requested_at', 'desc');
    }
}
