<?php

namespace App\Filament\Resources\Refunds\Schemas;

use App\Enums\RefundStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RefundForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('public_id')
                    ->required(),
                Select::make('payment_id')
                    ->relationship('payment', 'id')
                    ->required(),
                TextInput::make('requested_by')
                    ->numeric(),
                TextInput::make('amount_rials')
                    ->required()
                    ->numeric(),
                Select::make('status')
                    ->options(RefundStatus::class)
                    ->default('pending')
                    ->required(),
                TextInput::make('idempotency_key')
                    ->required(),
                TextInput::make('gateway_refund_id'),
                Textarea::make('reason')
                    ->columnSpanFull(),
                DateTimePicker::make('requested_at')
                    ->required(),
                DateTimePicker::make('completed_at'),
                DateTimePicker::make('failed_at'),
                Textarea::make('metadata')
                    ->columnSpanFull(),
            ]);
    }
}
