<?php

namespace Tests\Feature\Api\V1;

use App\Models\Address;
use App\Models\Order;
use App\Models\OtpChallenge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_update_profile_and_manage_addresses(): void
    {
        [$user, $headers] = $this->authenticatedUser();

        $this->patchJson(route('api.v1.account.profile.update'), [
            'name' => 'نام جدید',
            'email' => 'new@example.com',
        ], $headers)->assertOk()->assertJsonPath('data.name', 'نام جدید');

        $created = $this->postJson(route('api.v1.addresses.store'), [
            'label' => 'خانه', 'recipientName' => 'رضا احمدی', 'phone' => '09121234567',
            'province' => 'گیلان', 'city' => 'رشت', 'postalCode' => '1234567890',
            'addressLine' => 'خیابان معلم', 'isDefault' => true,
        ], $headers)->assertCreated();

        $addressId = $created->json('data.id');
        $this->getJson(route('api.v1.addresses.index'), $headers)
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.isDefault', true);
        $this->patchJson(route('api.v1.addresses.update', $addressId), [
            'label' => 'محل کار', 'recipientName' => 'رضا احمدی', 'phone' => '09121234567',
            'province' => 'تهران', 'city' => 'تهران', 'postalCode' => null,
            'addressLine' => 'میدان ونک', 'isDefault' => false,
        ], $headers)->assertOk()
            ->assertJsonPath('data.city', 'تهران')
            ->assertJsonPath('data.isDefault', true);
        $this->deleteJson(route('api.v1.addresses.destroy', $addressId), [], $headers)->assertNoContent();

        $this->assertDatabaseMissing(Address::class, ['user_id' => $user->id, 'deleted_at' => null]);
    }

    public function test_customer_only_sees_their_order_history(): void
    {
        [$user, $headers] = $this->authenticatedUser();
        $ownOrder = Order::factory()->create(['user_id' => $user->id]);
        Order::factory()->create();

        $this->getJson(route('api.v1.account.orders.index'), $headers)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $ownOrder->public_id);
    }

    public function test_password_reset_and_phone_verification_use_single_use_otp_codes(): void
    {
        [$user, $headers] = $this->authenticatedUser();

        $this->postJson(route('api.v1.auth.password.request'), ['phone' => $user->phone])
            ->assertStatus(202);
        $this->assertDatabaseHas(OtpChallenge::class, ['phone' => $user->phone, 'purpose' => 'password_reset']);

        OtpChallenge::query()->where('phone', $user->phone)->update(['consumed_at' => now()]);
        OtpChallenge::query()->create([
            'user_id' => $user->id, 'phone' => $user->phone, 'purpose' => 'password_reset',
            'code_hash' => Hash::make('123456'), 'expires_at' => now()->addMinutes(5),
        ]);
        $this->postJson(route('api.v1.auth.password.confirm'), [
            'phone' => $user->phone, 'code' => '123456', 'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));

        OtpChallenge::query()->create([
            'user_id' => $user->id, 'phone' => $user->phone, 'purpose' => 'phone_verification',
            'code_hash' => Hash::make('654321'), 'expires_at' => now()->addMinutes(5),
        ]);
        $newToken = 'replacement-token-after-password-reset';
        $user->apiTokens()->create(['token_hash' => hash('sha256', $newToken), 'expires_at' => now()->addDay()]);
        $this->postJson(route('api.v1.account.phone-verification.confirm'), ['code' => '654321'], [
            'Authorization' => "Bearer {$newToken}",
        ])->assertOk();
        $this->assertNotNull($user->fresh()->phone_verified_at);
    }

    /** @return array{User, array<string, string>} */
    private function authenticatedUser(): array
    {
        $user = User::factory()->create(['phone' => '09121234567']);
        $token = 'account-feature-test-token';
        $user->apiTokens()->create(['token_hash' => hash('sha256', $token), 'expires_at' => now()->addDay()]);

        return [$user, ['Authorization' => "Bearer {$token}"]];
    }
}
