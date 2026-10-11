<?php

namespace Tests\Feature\Api\V1;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_and_receive_a_plain_token_once(): void
    {
        $response = $this->postJson(route('api.v1.auth.register'), [
            'name' => 'رضا احمدی',
            'phone' => '۰۹۱۲۱۲۳۴۵۶۷',
            'password' => 'strong-password',
            'password_confirmation' => 'strong-password',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.phone', '09121234567')
            ->assertJsonPath('data.name', 'رضا احمدی');

        $plainToken = $response->json('meta.token');
        $user = User::query()->where('phone', '09121234567')->firstOrFail();

        $this->assertTrue(Hash::check('strong-password', $user->password));
        $this->assertDatabaseHas(ApiToken::class, [
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plainToken),
        ]);
        $this->assertDatabaseMissing(ApiToken::class, ['token_hash' => $plainToken]);
    }

    public function test_customer_can_login_read_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'phone' => '09121234567',
            'password' => 'strong-password',
        ]);

        $login = $this->postJson(route('api.v1.auth.login'), [
            'phone' => '09121234567',
            'password' => 'strong-password',
        ])->assertOk();
        $token = $login->json('meta.token');
        $headers = ['Authorization' => "Bearer {$token}"];

        $this->getJson(route('api.v1.auth.me'), $headers)
            ->assertOk()
            ->assertJsonPath('data.id', $user->public_id);

        $this->postJson(route('api.v1.auth.logout'), [], $headers)->assertNoContent();
        $this->getJson(route('api.v1.auth.me'), $headers)->assertUnauthorized();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create(['phone' => '09121234567', 'password' => 'correct-password']);

        $this->postJson(route('api.v1.auth.login'), [
            'phone' => '09121234567',
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    public function test_order_routes_require_authentication(): void
    {
        $this->postJson(route('api.v1.orders.store'))->assertUnauthorized();
        $this->getJson(route('api.v1.orders.show', '01M4GP3QG0AZHCMGHHMH4HP6DD'))->assertUnauthorized();
    }
}
