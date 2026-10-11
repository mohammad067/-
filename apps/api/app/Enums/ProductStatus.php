<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum ProductStatus: string implements HasColor, HasLabel
{
    case Draft = 'draft';
    case Active = 'active';
    case Archived = 'archived';

    public function getLabel(): string
    {
        return match ($this) {
            self::Draft => 'پیش‌نویس', self::Active => 'فعال', self::Archived => 'بایگانی'
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Draft => 'gray', self::Active => 'success', self::Archived => 'danger'
        };
    }
}
