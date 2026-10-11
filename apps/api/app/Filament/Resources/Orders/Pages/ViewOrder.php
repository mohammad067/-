<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Actions\Orders\TransitionOrderStatus;
use App\Enums\OrderStatus;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('changeStatus')
                ->label('تغییر وضعیت سفارش')
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
                    $this->refreshFormData(['status', 'cancelled_at', 'completed_at']);
                    Notification::make()->title('وضعیت سفارش تغییر کرد.')->success()->send();
                })
                ->visible(fn (Order $record): bool => TransitionOrderStatus::allowedTargets($record->status) !== []),
        ];
    }
}
