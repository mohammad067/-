<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Actions\Orders\TransitionOrderStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->label('شماره سفارش')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->label('مشتری')
                    ->searchable(),
                TextColumn::make('customer_phone')
                    ->label('موبایل')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('وضعیت سفارش')
                    ->badge()
                    ->searchable(),
                TextColumn::make('payment_status')
                    ->label('وضعیت پرداخت')
                    ->badge()
                    ->searchable(),
                TextColumn::make('total_rials')
                    ->label('مبلغ کل (ریال)')
                    ->money('IRR')
                    ->sortable(),
                TextColumn::make('placed_at')
                    ->label('زمان ثبت')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('expires_at')
                    ->label('مهلت پرداخت')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('changeStatus')
                    ->label('تغییر وضعیت')
                    ->schema([
                        Select::make('status')
                            ->label('وضعیت جدید')
                            ->options(fn (Order $record): array => collect(TransitionOrderStatus::allowedTargets($record->status))
                                ->mapWithKeys(fn (OrderStatus $status): array => [$status->value => $status->getLabel()])
                                ->all())
                            ->required(),
                        Textarea::make('reason')->label('توضیح'),
                    ])
                    ->action(function (Order $record, array $data): void {
                        $user = auth()->user();
                        if (! $user instanceof User) {
                            return;
                        }

                        app(TransitionOrderStatus::class)->handle(
                            $record,
                            OrderStatus::from($data['status']),
                            $user,
                            $data['reason'] ?? null,
                        );
                        Notification::make()->title('وضعیت سفارش تغییر کرد.')->success()->send();
                    })
                    ->visible(fn (Order $record): bool => TransitionOrderStatus::allowedTargets($record->status) !== []),
            ])
            ->defaultSort('placed_at', 'desc');
    }
}
