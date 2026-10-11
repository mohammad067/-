<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreAddressRequest;
use App\Http\Requests\Api\V1\UpdateAddressRequest;
use App\Http\Resources\Api\V1\AddressResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $user = request()->user();
        abort_unless($user instanceof User, 401);

        return AddressResource::collection($user->addresses()->latest('is_default')->latest()->get());
    }

    public function store(StoreAddressRequest $request): AddressResource
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        $address = DB::transaction(function () use ($request, $user): Address {
            $data = $this->attributes($request->validated());
            if (($data['is_default'] ?? false) || ! $user->addresses()->exists()) {
                $user->addresses()->update(['is_default' => false]);
                $data['is_default'] = true;
            }

            return $user->addresses()->create($data);
        });

        return AddressResource::make($address);
    }

    public function update(UpdateAddressRequest $request, string $address): AddressResource
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);
        $model = $user->addresses()->where('public_id', $address)->firstOrFail();

        DB::transaction(function () use ($request, $user, $model): void {
            $data = $this->attributes($request->validated());
            if ($data['is_default'] ?? false) {
                $user->addresses()->whereKeyNot($model->id)->update(['is_default' => false]);
            } elseif ($model->is_default) {
                $data['is_default'] = true;
            }
            $model->update($data);
        });

        return AddressResource::make($model->fresh());
    }

    public function destroy(string $address): Response
    {
        $user = request()->user();
        abort_unless($user instanceof User, 401);
        $model = $user->addresses()->where('public_id', $address)->firstOrFail();
        $wasDefault = $model->is_default;
        $model->delete();

        if ($wasDefault) {
            $user->addresses()->latest()->first()?->update(['is_default' => true]);
        }

        return response()->noContent();
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function attributes(array $data): array
    {
        return [
            'label' => $data['label'] ?? null,
            'recipient_name' => $data['recipientName'],
            'phone' => $data['phone'],
            'province' => $data['province'],
            'city' => $data['city'],
            'postal_code' => $data['postalCode'] ?? null,
            'address_line' => $data['addressLine'],
            'is_default' => $data['isDefault'] ?? false,
        ];
    }
}
