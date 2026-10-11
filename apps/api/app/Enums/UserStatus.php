<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum UserStatus: string implements HasColor, HasLabel
{
    case Active = 'active';
    case Suspended = 'suspended';
    case Disabled = 'disabled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Active => 'فعال', self::Suspended => 'معلق', self::Disabled => 'غیرفعال'
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Active => 'success', self::Suspended => 'warning', self::Disabled => 'danger'
        };
    }
}
