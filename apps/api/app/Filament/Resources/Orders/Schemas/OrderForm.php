<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('public_id')
                    ->required(),
                TextInput::make('order_number')
                    ->required(),
                Select::make('user_id')
                    ->relationship('user', 'name'),
                Select::make('cart_id')
                    ->relationship('cart', 'id'),
                Select::make('status')
                    ->options(OrderStatus::class)
                    ->default('pending_payment')
                    ->required(),
                Select::make('payment_status')
                    ->options(PaymentStatus::class)
                    ->default('pending')
                    ->required(),
                TextInput::make('currency')
                    ->required()
                    ->default('IRR'),
                TextInput::make('subtotal_rials')
                    ->required()
                    ->numeric(),
                TextInput::make('discount_rials')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('shipping_rials')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('tax_rials')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('total_rials')
                    ->required()
                    ->numeric(),
                TextInput::make('discount_code'),
                TextInput::make('shipping_method_code'),
                TextInput::make('shipping_method_name'),
                Textarea::make('customer_note')
                    ->columnSpanFull(),
                DateTimePicker::make('placed_at')
                    ->required(),
                DateTimePicker::make('paid_at'),
                DateTimePicker::make('cancelled_at'),
                DateTimePicker::make('expires_at'),
                DateTimePicker::make('completed_at'),
                TextInput::make('customer_phone')
                    ->tel(),
                TextInput::make('customer_email')
                    ->email(),
                TextInput::make('checkout_idempotency_key'),
                TextInput::make('access_token_hash'),
            ]);
    }
}
