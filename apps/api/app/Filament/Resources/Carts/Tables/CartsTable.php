<?php

namespace App\Filament\Resources\Carts\Tables;

use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CartsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('public_id')
                    ->label('شناسه سبد')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->label('کاربر')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('وضعیت')
                    ->badge()
                    ->searchable(),
                TextColumn::make('last_activity_at')
                    ->label('آخرین فعالیت')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('abandoned_at')
                    ->label('زمان رهاشدن')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('reminder_sent_at')
                    ->label('یادآوری')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->defaultSort('abandoned_at', 'desc');
    }
}
