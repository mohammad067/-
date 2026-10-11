<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum ShipmentStatus: string implements HasColor, HasLabel
{
    case Pending = 'pending';
    case Preparing = 'preparing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'در انتظار', self::Preparing => 'آماده‌سازی', self::Shipped => 'ارسال‌شده',
            self::Delivered => 'تحویل‌شده', self::Returned => 'مرجوع‌شده', self::Cancelled => 'لغوشده',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Pending => 'warning', self::Preparing => 'info', self::Shipped => 'primary',
            self::Delivered => 'success', self::Returned, self::Cancelled => 'danger',
        };
    }
}
