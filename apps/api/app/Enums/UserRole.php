<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum UserRole: string implements HasColor, HasLabel
{
    case Customer = 'customer';
    case Staff = 'staff';
    case Admin = 'admin';

    public function getLabel(): string
    {
        return match ($this) {
            self::Customer => 'مشتری', self::Staff => 'کارمند', self::Admin => 'مدیر'
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Customer => 'gray', self::Staff => 'info', self::Admin => 'success'
        };
    }
}
