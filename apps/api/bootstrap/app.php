<?php

use App\Exceptions\Domain\CartUnavailable;
use App\Exceptions\Domain\EmptyCart;
use App\Exceptions\Domain\InsufficientStock;
use App\Http\Middleware\AuthenticateApiToken;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['auth.api' => AuthenticateApiToken::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (EmptyCart $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'error' => [
                    'code' => 'EMPTY_CART',
                    'message' => 'سبد خرید خالی است.',
                ],
            ], 409);
        });

        $exceptions->render(function (CartUnavailable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'error' => [
                    'code' => 'CART_UNAVAILABLE',
                    'message' => 'این سبد خرید قابل ثبت سفارش نیست.',
                ],
            ], 409);
        });

        $exceptions->render(function (InsufficientStock $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'error' => [
                    'code' => 'INSUFFICIENT_STOCK',
                    'message' => 'موجودی کالا برای تعداد درخواستی کافی نیست.',
                    'details' => [
                        'variantId' => $exception->variantPublicId,
                        'requestedQuantity' => $exception->requestedQuantity,
                        'availableQuantity' => $exception->availableQuantity,
                    ],
                ],
            ], 409);
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
