<?php

namespace App\Filament\Resources\Payments\Schemas;

use App\Enums\PaymentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('public_id')
                    ->required(),
                Select::make('order_id')
                    ->relationship('order', 'id')
                    ->required(),
                TextInput::make('gateway')
                    ->required(),
                Select::make('status')
                    ->options(PaymentStatus::class)
                    ->default('pending')
                    ->required(),
                TextInput::make('amount_rials')
                    ->required()
                    ->numeric(),
                TextInput::make('currency')
                    ->required()
                    ->default('IRR'),
                TextInput::make('idempotency_key')
                    ->required(),
                TextInput::make('authority'),
                TextInput::make('gateway_transaction_id'),
                Textarea::make('redirect_url')
                    ->columnSpanFull(),
                TextInput::make('failure_code'),
                Textarea::make('failure_message')
                    ->columnSpanFull(),
                DateTimePicker::make('requested_at'),
                DateTimePicker::make('verified_at'),
                DateTimePicker::make('paid_at'),
                DateTimePicker::make('failed_at'),
                DateTimePicker::make('cancelled_at'),
                Textarea::make('metadata')
                    ->columnSpanFull(),
            ]);
    }
}
