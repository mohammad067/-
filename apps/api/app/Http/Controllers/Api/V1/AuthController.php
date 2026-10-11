<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            ...$request->safe()->only(['name', 'phone', 'password']),
            'role' => UserRole::Customer,
            'status' => UserStatus::Active,
        ]);

        return $this->tokenResponse($user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('phone', $request->string('phone'))->first();

        if ($user === null || $user->status !== UserStatus::Active || ! Hash::check($request->string('password'), $user->password)) {
            return response()->json(['message' => 'شماره موبایل یا رمز عبور نادرست است.'], 422);
        }

        $user->update(['last_login_at' => now()]);

        return $this->tokenResponse($user);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->userData($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->attributes->get('api_token')?->delete();

        return response()->json(null, 204);
    }

    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        $plainTextToken = Str::random(80);
        $user->apiTokens()->create([
            'token_hash' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addDays((int) config('commerce.auth.token_ttl_days')),
        ]);

        return response()->json([
            'data' => $this->userData($user),
            'meta' => ['token' => $plainTextToken],
        ], $status)->header('Cache-Control', 'no-store');
    }

    /** @return array{id: string, name: ?string, phone: ?string, email: ?string, phoneVerified: bool} */
    private function userData(User $user): array
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
