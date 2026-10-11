<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum RefundStatus: string implements HasColor, HasLabel
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Failed = 'failed';
    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'در انتظار', self::Processing => 'در حال پردازش', self::Completed => 'تکمیل‌شده',
            self::Failed => 'ناموفق', self::Cancelled => 'لغوشده',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Pending => 'warning', self::Processing => 'info', self::Completed => 'success',
            self::Failed, self::Cancelled => 'danger',
        };
    }
}
