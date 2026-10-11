<?php

namespace App\Enums;

enum InventoryMovementType: string
{
    case Receipt = 'receipt';
    case Reservation = 'reservation';
    case ReservationRelease = 'reservation_release';
    case Sale = 'sale';
    case Return = 'return';
    case Correction = 'correction';
}
