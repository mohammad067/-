<?php

namespace App\Filament\Resources\Carts;

use App\Enums\CartStatus;
use App\Filament\Resources\Carts\Pages\ListCarts;
use App\Filament\Resources\Carts\Pages\ViewCart;
use App\Filament\Resources\Carts\Schemas\CartForm;
use App\Filament\Resources\Carts\Schemas\CartInfolist;
use App\Filament\Resources\Carts\Tables\CartsTable;
use App\Models\Cart;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CartResource extends Resource
{
    protected static ?string $model = Cart::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClock;

    protected static string|\UnitEnum|null $navigationGroup = 'عملیات';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'public_id';

    protected static ?string $modelLabel = 'سبد رهاشده';

    protected static ?string $pluralModelLabel = 'سبدهای رهاشده';

    protected static ?string $navigationLabel = 'سبدهای رهاشده';

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()
            ->where('status', CartStatus::Abandoned)
            ->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Schema $schema): Schema
    {
        return CartForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return CartInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CartsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCarts::route('/'),
            'view' => ViewCart::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('status', CartStatus::Abandoned->value);
    }
}
