<?php

namespace App\Filament\Resources\Payments\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PaymentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('public_id'),
                TextEntry::make('order.id')
                    ->label('Order'),
                TextEntry::make('gateway'),
                TextEntry::make('status')
                    ->badge(),
                TextEntry::make('amount_rials')
                    ->numeric(),
                TextEntry::make('currency'),
                TextEntry::make('idempotency_key'),
                TextEntry::make('authority')
                    ->placeholder('-'),
                TextEntry::make('gateway_transaction_id')
                    ->placeholder('-'),
                TextEntry::make('redirect_url')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('failure_code')
                    ->placeholder('-'),
                TextEntry::make('failure_message')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('requested_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('verified_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('paid_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('failed_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('cancelled_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('metadata')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
