<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum CartStatus: string implements HasColor, HasLabel
{
    case Active = 'active';
    case Converted = 'converted';
    case Abandoned = 'abandoned';
    case Expired = 'expired';

    public function getLabel(): string
    {
        return match ($this) {
            self::Active => 'فعال', self::Converted => 'تبدیل‌شده',
            self::Abandoned => 'رهاشده', self::Expired => 'منقضی‌شده',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Active => 'success', self::Converted => 'info', self::Abandoned => 'warning', self::Expired => 'danger',
        };
    }
}
