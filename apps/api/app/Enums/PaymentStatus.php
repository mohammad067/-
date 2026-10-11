<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum PaymentStatus: string implements HasColor, HasLabel
{
    case Pending = 'pending';
    case AwaitingVerification = 'awaiting_verification';
    case Paid = 'paid';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
    case PartiallyRefunded = 'partially_refunded';
    case Refunded = 'refunded';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'در انتظار پرداخت', self::AwaitingVerification => 'در انتظار تأیید',
            self::Paid => 'موفق', self::Failed => 'ناموفق', self::Cancelled => 'لغوشده',
            self::PartiallyRefunded => 'بازپرداخت جزئی', self::Refunded => 'بازپرداخت کامل',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Pending, self::AwaitingVerification => 'warning', self::Paid => 'success',
            self::Failed, self::Cancelled => 'danger', self::PartiallyRefunded, self::Refunded => 'gray',
        };
    }
}
