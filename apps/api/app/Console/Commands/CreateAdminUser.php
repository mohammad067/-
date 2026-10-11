<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

#[Signature('admin:create {--name=} {--email=} {--phone=} {--password=}')]
#[Description('Create or promote a user who can access the Filament admin panel')]
class CreateAdminUser extends Command
{
    public function handle(): int
    {
        $data = [
            'name' => $this->option('name') ?: $this->ask('نام مدیر'),
            'email' => $this->option('email') ?: $this->ask('ایمیل مدیر'),
            'phone' => $this->option('phone') ?: $this->ask('شماره موبایل مدیر'),
            'password' => $this->option('password') ?: $this->secret('رمز عبور (حداقل ۸ کاراکتر)'),
        ];

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^09\d{9}$/'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        $userByEmail = User::query()->where('email', $data['email'])->first();
        $userByPhone = User::query()->where('phone', $data['phone'])->first();

        if ($userByEmail !== null && $userByPhone !== null && ! $userByEmail->is($userByPhone)) {
            $this->error('ایمیل و شماره موبایل واردشده متعلق به دو حساب متفاوت هستند.');

            return self::FAILURE;
        }

        $user = $userByEmail ?? $userByPhone ?? new User;
        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'role' => UserRole::Admin,
            'status' => UserStatus::Active,
        ]);
        $user->save();

        $this->info("مدیر {$user->email} آماده است. آدرس پنل: /admin");

        return self::SUCCESS;
    }
}
