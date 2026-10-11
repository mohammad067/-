<?php

namespace App\Filament\Resources\Carts\Schemas;

use App\Enums\CartStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CartForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('public_id')
                    ->required(),
                Select::make('user_id')
                    ->relationship('user', 'name'),
                TextInput::make('access_token_hash'),
                Select::make('status')
                    ->options(CartStatus::class)
                    ->default('active')
                    ->required(),
                TextInput::make('currency')
                    ->required()
                    ->default('IRR'),
                DateTimePicker::make('expires_at'),
                DateTimePicker::make('last_activity_at'),
                DateTimePicker::make('abandoned_at'),
                DateTimePicker::make('recovered_at'),
                DateTimePicker::make('reminder_sent_at'),
            ]);
    }
}
