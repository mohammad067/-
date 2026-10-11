<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('order_number')->label('شماره سفارش'),
            TextEntry::make('user.name')->label('مشتری')->placeholder('-'),
            TextEntry::make('customer_phone')->label('موبایل'),
            TextEntry::make('customer_email')->label('ایمیل')->placeholder('-'),
            TextEntry::make('status')->label('وضعیت سفارش')->badge(),
            TextEntry::make('payment_status')->label('وضعیت پرداخت')->badge(),
            TextEntry::make('total_rials')->label('مبلغ کل')->money('IRR'),
            TextEntry::make('shipping_method_name')->label('روش ارسال')->placeholder('-'),
            TextEntry::make('placed_at')->label('زمان ثبت')->dateTime(),
            TextEntry::make('expires_at')->label('مهلت پرداخت')->dateTime()->placeholder('-'),
            TextEntry::make('customer_note')->label('یادداشت مشتری')->placeholder('-')->columnSpanFull(),
            RepeatableEntry::make('items')
                ->label('اقلام سفارش')
                ->schema([
                    TextEntry::make('product_name')->label('محصول'),
                    TextEntry::make('variant_name')->label('واریانت'),
                    TextEntry::make('quantity')->label('تعداد')->numeric(),
                    TextEntry::make('line_total_rials')->label('مبلغ')->money('IRR'),
                ])->columns(4)->columnSpanFull(),
            RepeatableEntry::make('addresses')
                ->label('نشانی سفارش')
                ->schema([
                    TextEntry::make('recipient_name')->label('تحویل‌گیرنده'),
                    TextEntry::make('phone')->label('موبایل'),
                    TextEntry::make('province')->label('استان'),
                    TextEntry::make('city')->label('شهر'),
                    TextEntry::make('address_line')->label('نشانی')->columnSpanFull(),
                ])->columns(4)->columnSpanFull(),
            RepeatableEntry::make('statusHistory')
                ->label('تاریخچه وضعیت')
                ->schema([
                    TextEntry::make('from_status')->label('از')->placeholder('-'),
                    TextEntry::make('to_status')->label('به'),
                    TextEntry::make('reason')->label('توضیح')->placeholder('-'),
                    TextEntry::make('created_at')->label('زمان')->dateTime(),
                ])->columns(4)->columnSpanFull(),
        ]);
    }
}
