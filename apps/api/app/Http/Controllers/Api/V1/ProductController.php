<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListProductsRequest;
use App\Http\Resources\Api\V1\ProductResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(ListProductsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $query = $this->storefrontQuery()
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('rice_variety', 'like', "%{$search}%")
                        ->orWhere('origin_city', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn (Builder $query, string $slug): Builder => $query->whereHas(
                'category',
                fn (Builder $categoryQuery): Builder => $categoryQuery->where('slug', $slug)->where('is_active', true),
            ))
            ->when($filters['province'] ?? null, fn (Builder $query, string $province): Builder => $query->where('origin_province', $province))
            ->when($filters['variety'] ?? null, fn (Builder $query, string $variety): Builder => $query->where('rice_variety', $variety))
            ->when(array_key_exists('featured', $filters), fn (Builder $query): Builder => $query->where('is_featured', $filters['featured']));

        match ($filters['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy($this->minimumPriceQuery()),
            'price_desc' => $query->orderByDesc($this->minimumPriceQuery()),
            default => $query->orderByDesc('published_at'),
        };

        $products = $query
            ->orderByDesc('id')
            ->cursorPaginate($filters['limit'] ?? 12)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        abort_unless(
            $product->status === ProductStatus::Active
            && $product->published_at?->isPast(),
            404,
        );

        $product->load([
            'category',
            'images',
            'variants' => $this->loadActiveVariants(...),
        ]);

        abort_if($product->variants->isEmpty(), 404);

        return ProductResource::make($product);
    }

    private function storefrontQuery(): Builder
    {
        return Product::query()
            ->where('status', ProductStatus::Active->value)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->whereHas('variants', $this->filterActiveVariants(...))
            ->with([
                'category',
                'images',
                'variants' => $this->loadActiveVariants(...),
            ]);
    }

    private function minimumPriceQuery(): Builder
    {
        return ProductVariant::query()
            ->select('price_rials')
            ->whereColumn('product_variants.product_id', 'products.id')
            ->where('status', ProductStatus::Active->value)
            ->orderBy('price_rials')
            ->limit(1);
    }

    private function filterActiveVariants(Builder $query): void
    {
        $query->where('status', ProductStatus::Active->value);
    }

    private function loadActiveVariants(HasMany $query): void
    {
        $query
            ->where('status', ProductStatus::Active->value)
            ->with(['inventoryItem', 'images'])
            ->orderBy('position')
            ->orderBy('id');
    }
}
