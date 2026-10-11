<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Auth\IssueOtp;
use App\Actions\Auth\VerifyOtp;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ConfirmPasswordResetRequest;
use App\Http\Requests\Api\V1\RequestPasswordResetRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    public function request(RequestPasswordResetRequest $request, IssueOtp $issueOtp): JsonResponse
    {
        $user = User::query()->where('phone', $request->string('phone'))->first();
        if ($user !== null) {
            $issueOtp->handle($user->phone, 'password_reset', $user, $request->ip());
        }

        return response()->json(['message' => 'اگر این شماره ثبت شده باشد، کد بازیابی ارسال می‌شود.'], 202);
    }

    public function confirm(ConfirmPasswordResetRequest $request, VerifyOtp $verifyOtp): JsonResponse
    {
        $user = User::query()->where('phone', $request->string('phone'))->first();
        if ($user === null) {
            throw ValidationException::withMessages(['code' => 'کد تأیید نامعتبر یا منقضی شده است.']);
        }

        $verifyOtp->handle($user->phone, 'password_reset', $request->string('code'));
        $user->update(['password' => $request->string('password')]);
        $user->apiTokens()->delete();

        return response()->json(['message' => 'رمز عبور تغییر کرد. اکنون وارد شوید.']);
    }
}
