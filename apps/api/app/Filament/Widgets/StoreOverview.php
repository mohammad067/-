<?php

namespace App\Filament\Widgets;

use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\Payments\PaymentResource;
use App\Filament\Resources\Users\UserResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StoreOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 2;

    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $todayOrders = Order::query()->whereDate('placed_at', today())->count();
        $sevenDaySalesRials = (int) Payment::query()
            ->where('status', PaymentStatus::Paid)
            ->where('paid_at', '>=', now()->subDays(7))
            ->sum('amount_rials');
        $isAdmin = auth()->user()?->role === UserRole::Admin;
        $totalUsers = $isAdmin ? User::query()->count() : 0;
        $newUsers = $isAdmin ? User::query()->where('created_at', '>=', now()->subDays(7))->count() : 0;

        return [
            Stat::make('سفارش‌های امروز', number_format($todayOrders))
                ->description('سفارش ثبت‌شده از ابتدای امروز')
                ->descriptionIcon(Heroicon::OutlinedShoppingCart)
                ->color('warning')
                ->icon(Heroicon::OutlinedShoppingBag)
                ->url(OrderResource::getUrl()),
            Stat::make('فروش ۷ روز اخیر', number_format(intdiv($sevenDaySalesRials, 10)).' تومان')
                ->description('مجموع پرداخت‌های موفق')
                ->descriptionIcon(Heroicon::OutlinedChartBar)
                ->color('success')
                ->icon(Heroicon::OutlinedBanknotes)
                ->url(PaymentResource::getUrl()),
            ...($isAdmin ? [
                Stat::make('کل کاربران', number_format($totalUsers))
                    ->description('حساب‌های ثبت‌شده فروشگاه')
                    ->descriptionIcon(Heroicon::OutlinedUsers)
                    ->color('info')
                    ->icon(Heroicon::OutlinedUsers)
                    ->url(UserResource::getUrl()),
                Stat::make('ثبت‌نام ۷ روز اخیر', number_format($newUsers))
                    ->description('کاربران جدید این هفته')
                    ->descriptionIcon(Heroicon::OutlinedClock)
                    ->color('primary')
                    ->icon(Heroicon::OutlinedUserPlus)
                    ->url(UserResource::getUrl()),
            ] : []),
        ];
    }
}
