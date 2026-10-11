<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Auth\IssueOtp;
use App\Actions\Auth\VerifyOtp;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\VerifyPhoneRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PhoneVerificationController extends Controller
{
    public function request(Request $request, IssueOtp $issueOtp): JsonResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        if ($user->phone_verified_at === null) {
            $issueOtp->handle($user->phone, 'phone_verification', $user, $request->ip());
        }

        return response()->json(['message' => 'کد تأیید ارسال شد.'], 202);
    }

    public function confirm(VerifyPhoneRequest $request, VerifyOtp $verifyOtp): JsonResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);
        $verifyOtp->handle($user->phone, 'phone_verification', $request->string('code'));
        $user->update(['phone_verified_at' => now()]);

        return response()->json(['message' => 'شماره موبایل تأیید شد.']);
    }
}
