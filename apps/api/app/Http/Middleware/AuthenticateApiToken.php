<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    /** @param  Closure(Request): Response  $next */
    public function handle(Request $request, Closure $next): Response
    {
        $plainTextToken = $request->bearerToken();
        $token = is_string($plainTextToken) && $plainTextToken !== ''
            ? ApiToken::query()
                ->with('user')
                ->where('token_hash', hash('sha256', $plainTextToken))
                ->where('expires_at', '>', now())
                ->first()
            : null;

        if ($token === null || $token->user === null || $token->user->status !== UserStatus::Active) {
            return response()->json(['message' => 'برای ادامه وارد حساب کاربری شوید.'], 401);
        }

        $request->setUserResolver(fn () => $token->user);
        $request->attributes->set('api_token', $token);

        if ($token->last_used_at === null || $token->last_used_at->lt(now()->subHour())) {
            $token->update(['last_used_at' => now()]);
        }

        return $next($request);
    }
}
