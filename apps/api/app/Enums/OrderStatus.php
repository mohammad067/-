<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum OrderStatus: string implements HasColor, HasLabel
{
    case PendingPayment = 'pending_payment';
    case Paid = 'paid';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Refunded = 'refunded';

    public function getLabel(): string
    {
        return match ($this) {
            self::PendingPayment => 'در انتظار پرداخت', self::Paid => 'پرداخت‌شده',
            self::Processing => 'در حال آماده‌سازی', self::Shipped => 'ارسال‌شده',
            self::Delivered => 'تحویل‌شده', self::Cancelled => 'لغوشده',
            self::Expired => 'منقضی‌شده', self::Refunded => 'بازپرداخت‌شده',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::PendingPayment => 'warning', self::Paid, self::Processing => 'info',
            self::Shipped => 'primary', self::Delivered => 'success',
            self::Cancelled, self::Expired => 'danger', self::Refunded => 'gray',
        };
    }
}
