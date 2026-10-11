<?php

use App\Http\Controllers\Api\V1\AccountOrderController;
use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CartItemController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PasswordResetController;
use App\Http\Controllers\Api\V1\PhoneVerificationController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::middleware('throttle:6,1')->group(function (): void {
        Route::post('auth/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('auth/password/request', [PasswordResetController::class, 'request'])->name('auth.password.request');
        Route::post('auth/password/confirm', [PasswordResetController::class, 'confirm'])->name('auth.password.confirm');
    });

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

    Route::post('carts', [CartController::class, 'store'])->name('carts.store');
    Route::get('carts/{cart}', [CartController::class, 'show'])->name('carts.show');
    Route::put('carts/{cart}/items/{variant}', [CartItemController::class, 'update'])->name('carts.items.update');
    Route::delete('carts/{cart}/items/{variant}', [CartItemController::class, 'destroy'])->name('carts.items.destroy');

    Route::middleware('auth.api')->group(function (): void {
        Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('account/profile', [ProfileController::class, 'show'])->name('account.profile.show');
        Route::patch('account/profile', [ProfileController::class, 'update'])->name('account.profile.update');
        Route::apiResource('account/addresses', AddressController::class)->except('show');
        Route::get('account/orders', [AccountOrderController::class, 'index'])->name('account.orders.index');
        Route::post('account/phone-verification/request', [PhoneVerificationController::class, 'request'])
            ->middleware('throttle:3,10')->name('account.phone-verification.request');
        Route::post('account/phone-verification/confirm', [PhoneVerificationController::class, 'confirm'])
            ->middleware('throttle:6,10')->name('account.phone-verification.confirm');
        Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('orders/by-number/{orderNumber}', [OrderController::class, 'showByNumber'])->name('orders.show-by-number');
        Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });
});
