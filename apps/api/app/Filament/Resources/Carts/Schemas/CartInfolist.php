<?php

namespace App\Filament\Resources\Carts\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class CartInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('public_id')->label('شناسه سبد'),
            TextEntry::make('user.name')->label('کاربر')->placeholder('مهمان'),
            TextEntry::make('status')->label('وضعیت')->badge(),
            TextEntry::make('last_activity_at')->label('آخرین فعالیت')->dateTime(),
            TextEntry::make('abandoned_at')->label('زمان رهاشدن')->dateTime(),
            TextEntry::make('reminder_sent_at')->label('زمان یادآوری')->dateTime()->placeholder('-'),
            RepeatableEntry::make('items')
                ->label('اقلام سبد')
                ->schema([
                    TextEntry::make('variant.product.name')->label('محصول'),
                    TextEntry::make('variant.title')->label('واریانت'),
                    TextEntry::make('quantity')->label('تعداد')->numeric(),
                    TextEntry::make('variant.price_rials')->label('قیمت واحد')->money('IRR'),
                ])->columns(4)->columnSpanFull(),
        ]);
    }
}
