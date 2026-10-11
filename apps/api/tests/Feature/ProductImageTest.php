<?php

namespace Tests\Feature;

use App\Filament\Resources\Products\Pages\EditProduct;
use App\Filament\Resources\Products\RelationManagers\ImagesRelationManager;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class ProductImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_product_always_has_only_one_primary_image(): void
    {
        $product = Product::factory()->create();
        $firstImage = $product->images()->create([
            'disk' => 'public',
            'path' => 'products/product-one/first.webp',
            'position' => 1,
            'is_primary' => false,
        ]);

        $this->assertTrue($firstImage->is_primary);

        $secondImage = $product->images()->create([
            'disk' => 'public',
            'path' => 'products/product-one/second.webp',
            'position' => 2,
            'is_primary' => true,
        ]);

        $this->assertFalse($firstImage->refresh()->is_primary);
        $this->assertTrue($secondImage->refresh()->is_primary);

        $secondImage->update(['is_primary' => false]);

        $this->assertSame(1, $product->images()->where('is_primary', true)->count());
    }

    public function test_replaced_and_deleted_product_image_files_are_removed_from_storage(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('products/product-one/old.webp', 'old-image');
        Storage::disk('public')->put('products/product-one/new.webp', 'new-image');

        $product = Product::factory()->create();
        $image = $product->images()->create([
            'disk' => 'public',
            'path' => 'products/product-one/old.webp',
            'position' => 1,
            'is_primary' => true,
        ]);

        $image->update(['path' => 'products/product-one/new.webp']);

        Storage::disk('public')->assertMissing('products/product-one/old.webp');
        Storage::disk('public')->assertExists('products/product-one/new.webp');

        $image->delete();

        Storage::disk('public')->assertMissing('products/product-one/new.webp');
    }

    public function test_admin_can_upload_multiple_product_images(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->admin()->create());
        filament()->setCurrentPanel(filament()->getPanel('admin'));
        $product = Product::factory()->create();

        Livewire::test(ImagesRelationManager::class, [
            'ownerRecord' => $product,
            'pageClass' => EditProduct::class,
        ])
            ->callTableAction('uploadImages', data: [
                'paths' => [
                    UploadedFile::fake()->createWithContent('front.png', $this->tinyPng()),
                    UploadedFile::fake()->createWithContent('back.png', $this->tinyPng()),
                ],
                'alt_text' => 'برنج هاشمی',
                'make_first_primary' => true,
            ])
            ->assertHasNoTableActionErrors();

        $this->assertCount(2, $product->images()->get());
        $this->assertSame(1, $product->images()->where('is_primary', true)->count());
        $this->assertCount(2, Storage::disk('public')->allFiles("products/{$product->public_id}"));
    }

    private function tinyPng(): string
    {
        return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=', true);
    }
}
