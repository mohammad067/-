<?php

namespace App\Observers;

use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProductImageObserver
{
    public function creating(ProductImage $productImage): void
    {
        $hasImages = ProductImage::query()
            ->where('product_id', $productImage->product_id)
            ->exists();

        if ($productImage->is_primary || ! $hasImages) {
            $productImage->is_primary = true;
            $this->clearOtherPrimaryImages($productImage);
        }
    }

    public function updating(ProductImage $productImage): void
    {
        if ($productImage->is_primary && ($productImage->isDirty('is_primary') || $productImage->isDirty('product_id'))) {
            $this->clearOtherPrimaryImages($productImage);
        }
    }

    public function updated(ProductImage $productImage): void
    {
        if ($productImage->wasChanged(['disk', 'path'])) {
            $this->deleteManagedFile(
                (string) $productImage->getOriginal('disk'),
                (string) $productImage->getOriginal('path'),
            );
        }

        if ($productImage->wasChanged('is_primary') && ! $productImage->is_primary) {
            $this->ensureProductHasPrimaryImage($productImage->product_id);
        }
    }

    public function deleted(ProductImage $productImage): void
    {
        $this->deleteManagedFile($productImage->disk, $productImage->path);
        $this->ensureProductHasPrimaryImage($productImage->product_id);
    }

    private function clearOtherPrimaryImages(ProductImage $productImage): void
    {
        ProductImage::query()
            ->where('product_id', $productImage->product_id)
            ->when($productImage->exists, fn ($query) => $query->whereKeyNot($productImage->getKey()))
            ->where('is_primary', true)
            ->update(['is_primary' => false]);
    }

    private function ensureProductHasPrimaryImage(int $productId): void
    {
        $images = ProductImage::query()->where('product_id', $productId);

        if ((clone $images)->where('is_primary', true)->exists()) {
            return;
        }

        $images->orderBy('position')->orderBy('id')->first()?->updateQuietly(['is_primary' => true]);
    }

    private function deleteManagedFile(string $disk, string $path): void
    {
        if ($path === '' || Str::startsWith($path, ['http://', 'https://']) || ! Str::startsWith($path, 'products/')) {
            return;
        }

        try {
            Storage::disk($disk)->delete($path);
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
