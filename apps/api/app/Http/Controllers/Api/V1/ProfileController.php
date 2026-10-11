<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->data($request->user())]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);
        $user->update($request->validated());

        return response()->json(['data' => $this->data($user->fresh())]);
    }

    /** @return array<string, mixed> */
    private function data(User $user): array
    {
        return [
            'id' => $user->public_id,
            'name' => $user->name,
            'phone' => $user->phone,
            'email' => $user->email,
            'phoneVerified' => $user->phone_verified_at !== null,
        ];
    }
}
