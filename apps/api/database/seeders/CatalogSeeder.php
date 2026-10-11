<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $ratings = [4.9, 5.0, 4.8, 4.7, 4.6, 4.9, 4.5, 4.9];
            $reviews = [148, 89, 112, 64, 41, 54, 22, 42];
            $aromaScores = [5, 5, 5, 4, 4, 4.5, 4, 5];
            $lengthScores = [4, 5, 4.5, 3.5, 4, 5, 4, 4.5];
            $images = [
                'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80&product=1',
                'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=900&q=80&product=2',
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80&product=3',
                'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80&product=4',
                'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80&product=5',
                'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80&product=6',
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80&product=7',
                'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80&product=8',
            ];
            $category = Category::query()->firstOrNew(['slug' => 'rice']);
            $category->forceFill([
                'public_id' => '01M4GP3QG0AZHCMGHHMH4HP6DN',
                'name' => 'برنج ایرانی',
                'description' => 'برنج شمال ایران',
                'is_active' => true,
            ])->save();

            foreach ($this->products() as $position => $item) {
                $product = Product::query()->firstOrNew(['slug' => $item['slug']]);
                $product->forceFill([
                    'public_id' => $item['product_id'],
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'short_description' => $item['summary'],
                    'description' => $item['description'],
                    'origin_province' => $item['province'],
                    'origin_city' => $item['city'],
                    'rice_variety' => $item['variety'],
                    'harvest_year' => 1404,
                    'status' => ProductStatus::Active,
                    'is_featured' => $position < 4,
                    'published_at' => now(),
                    'metadata' => [
                        'rating' => $ratings[$position],
                        'reviews_count' => $reviews[$position],
                        'aroma_score' => $aromaScores[$position],
                        'length_score' => $lengthScores[$position],
                    ],
                ])->save();

                $variant = ProductVariant::query()->firstOrNew(['sku' => $item['sku']]);
                $variant->forceFill([
                    'public_id' => $item['variant_id'],
                    'product_id' => $product->id,
                    'title' => $item['weight_grams'] / 1000 .' کیلوگرم',
                    'weight_grams' => $item['weight_grams'],
                    'price_rials' => $item['price_rials'],
                    'compare_at_price_rials' => $item['compare_at_price_rials'],
                    'position' => 0,
                    'status' => ProductStatus::Active,
                    'tracks_stock' => true,
                    'allows_backorder' => false,
                    'low_stock_threshold' => 5,
                ])->save();

                $inventory = InventoryItem::query()->firstOrNew(['product_variant_id' => $variant->id]);
                $inventory->on_hand = $item['stock'];

                if (! $inventory->exists) {
                    $inventory->reserved = 0;
                }

                $inventory->save();

                ProductImage::query()->updateOrCreate(
                    ['disk' => 'public', 'path' => $images[$position]],
                    [
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                        'alt_text' => $product->name,
                        'position' => 0,
                        'is_primary' => true,
                    ],
                );
            }
        });
    }

    /**
     * @return list<array{
     *     product_id: string, variant_id: string, slug: string, sku: string,
     *     name: string, summary: string, description: string, province: string,
     *     city: string, variety: string, weight_grams: int, price_rials: int,
     *     compare_at_price_rials: ?int, stock: int
     * }>
     */
    private function products(): array
    {
        return [
            ['product_id' => '01M4GP3QFZT78V2D7SP8V9E9TG', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DD', 'slug' => 'hashemi-super-premium-gilan', 'sku' => 'RICE-HASH-10', 'name' => 'برنج هاشمی آستانه اشرفیه', 'summary' => 'هاشمی آستانه؛ خوش‌پخت و مناسب مصرف روزانه.', 'description' => 'برنج هاشمی از شالیزار آستانه اشرفیه.', 'province' => 'گیلان', 'city' => 'آستانه اشرفیه', 'variety' => 'هاشمی', 'weight_grams' => 10000, 'price_rials' => 13050000, 'compare_at_price_rials' => 14500000, 'stock' => 35],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6D6', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DE', 'slug' => 'domsiah-royal-sadri-gilan', 'sku' => 'RICE-DOMSIAH-10', 'name' => 'برنج دم‌سیاه کیاشهر', 'summary' => 'دم‌سیاه گیلان با عطر سنگین و بافت نرم بعد از پخت.', 'description' => 'رقم دم‌سیاه از کیاشهر.', 'province' => 'گیلان', 'city' => 'کیاشهر', 'variety' => 'دم‌سیاه', 'weight_grams' => 10000, 'price_rials' => 18900000, 'compare_at_price_rials' => null, 'stock' => 12],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6D7', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DF', 'slug' => 'tarom-local-kest-second', 'sku' => 'RICE-TAROM-10', 'name' => 'برنج طارم کشت دوم فریدونکنار', 'summary' => 'طارم پاییزه فریدونکنار؛ معطر و سبک.', 'description' => 'کشت دوم طارم فریدونکنار.', 'province' => 'مازندران', 'city' => 'فریدونکنار', 'variety' => 'طارم', 'weight_grams' => 10000, 'price_rials' => 15960000, 'compare_at_price_rials' => 16800000, 'stock' => 20],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6D8', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DG', 'slug' => 'hashemi-diet-brown-rice', 'sku' => 'RICE-BROWN-HASH-5', 'name' => 'برنج قهوه‌ای هاشمی لاهیجان', 'summary' => 'همان رقم هاشمی با سبوس؛ رقم جدا نیست.', 'description' => 'قهوه‌ای یعنی سبوس مانده است.', 'province' => 'گیلان', 'city' => 'لاهیجان', 'variety' => 'هاشمی', 'weight_grams' => 5000, 'price_rials' => 7225000, 'compare_at_price_rials' => 8500000, 'stock' => 45],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6D9', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DH', 'slug' => 'tarom-hashemi-luxury-blend', 'sku' => 'RICE-FAJR-10', 'name' => 'برنج فجر رشت', 'summary' => 'فجر گیلان؛ یکدست و اقتصادی‌تر از ارقام محلی.', 'description' => 'فجر رقم جدا است.', 'province' => 'گیلان', 'city' => 'رشت', 'variety' => 'فجر', 'weight_grams' => 10000, 'price_rials' => 11900000, 'compare_at_price_rials' => null, 'stock' => 18],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6DA', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DJ', 'slug' => 'sadri-yellow-tail-gilan', 'sku' => 'RICE-SADRI-10', 'name' => 'برنج صدری رودسر', 'summary' => 'صدری قلمی رودسر برای پخت مهمانی.', 'description' => 'صدری گیلان، دانه باریک.', 'province' => 'گیلان', 'city' => 'رودسر', 'variety' => 'صدری', 'weight_grams' => 10000, 'price_rials' => 16100000, 'compare_at_price_rials' => 17500000, 'stock' => 8],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6DB', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DK', 'slug' => 'tarom-local-mahandasht', 'sku' => 'RICE-SHIROUDI-10', 'name' => 'برنج شیرودی تالش', 'summary' => 'شیرودی تالش؛ فعلاً موجود نیست.', 'description' => 'فقط گیلان و مازندران.', 'province' => 'گیلان', 'city' => 'تالش', 'variety' => 'شیرودی', 'weight_grams' => 10000, 'price_rials' => 10900000, 'compare_at_price_rials' => null, 'stock' => 0],
            ['product_id' => '01M4GP3QG0AZHCMGHHMH4HP6DC', 'variant_id' => '01M4GP3QG0AZHCMGHHMH4HP6DM', 'slug' => 'domsiah-gilan-aromatic', 'sku' => 'RICE-DOMSIAH-5', 'name' => 'برنج دم‌سیاه کیاشهر ۵ کیلویی', 'summary' => 'همان دم‌سیاه کیاشهر در بسته کوچک‌تر.', 'description' => 'بسته ۵ کیلویی.', 'province' => 'گیلان', 'city' => 'کیاشهر', 'variety' => 'دم‌سیاه', 'weight_grams' => 5000, 'price_rials' => 9900000, 'compare_at_price_rials' => null, 'stock' => 15],
        ];
    }
}
