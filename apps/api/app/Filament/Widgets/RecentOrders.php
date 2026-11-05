<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentOrders extends TableWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('آخرین سفارش‌ها')
            ->description('جدیدترین سفارش‌های ثبت‌شده در فروشگاه')
            ->query(fn (): Builder => Order::query()->with('user')->latest('placed_at')->latest('id'))
            ->columns([
                TextColumn::make('order_number')
                    ->label('شماره سفارش')
                    ->searchable()
                    ->weight('medium'),
                TextColumn::make('customer')
                    ->label('مشتری')
                    ->state(fn (Order $record): string => $record->user?->name ?: ($record->customer_phone ?: 'کاربر مهمان'))
                    ->searchable(query: fn (Builder $query, string $search): Builder => $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('customer_phone', 'like', "%{$search}%")
                            ->orWhereHas('user', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%"));
                    })),
                TextColumn::make('total_rials')
                    ->label('مبلغ کل')
                    ->formatStateUsing(fn (int $state): string => number_format(intdiv($state, 10)).' تومان')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('وضعیت')
                    ->badge(),
                TextColumn::make('placed_at')
                    ->label('تاریخ ثبت')
                    ->dateTime('Y/m/d H:i')
                    ->sortable(),
            ])
            ->recordUrl(fn (Order $record): string => OrderResource::getUrl('view', ['record' => $record]))
            ->paginated([10])
            ->defaultPaginationPageOption(10)
            ->emptyStateHeading('هنوز سفارشی ثبت نشده است')
            ->emptyStateDescription('سفارش‌های جدید در این بخش نمایش داده می‌شوند.');
    }
}
