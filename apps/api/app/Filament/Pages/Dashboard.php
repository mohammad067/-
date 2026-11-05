<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'داشبورد';

    protected static ?string $navigationLabel = 'داشبورد';

    public function getColumns(): int|array
    {
        return 1;
    }
}
