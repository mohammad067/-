<?php

namespace Tests\Feature;

use App\Enums\CartStatus;
use App\Enums\RefundStatus;
use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Refund;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_admin_but_admin_can_open_resources(): void
    {
        $customer = User::factory()->create();
        $this->actingAs($customer)->get('/admin')->assertForbidden();

        $admin = User::factory()->admin()->create();
        $this->actingAs($admin)->get('/admin')->assertOk();

        foreach (['products', 'product-variants', 'orders', 'payments', 'refunds', 'shipments', 'carts', 'users'] as $resource) {
            $this->get("/admin/{$resource}")->assertOk();
        }
    }

    public function test_staff_can_access_operations_but_not_user_management(): void
    {
        $staff = User::factory()->create(['role' => UserRole::Staff]);
        $this->actingAs($staff)->get('/admin/orders')->assertOk();
        $this->get('/admin/users')->assertForbidden();
    }

    public function test_admin_create_and_record_pages_render(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin);

        foreach (['products/create', 'product-variants/create', 'shipments/create', 'users/create'] as $path) {
            $this->get("/admin/{$path}")->assertOk();
        }

        $product = Product::factory()->create();
        $variant = ProductVariant::factory()->for($product)->create();
        $order = Order::factory()->create();
        $payment = Payment::factory()->for($order)->create();
        $refund = Refund::query()->create([
            'payment_id' => $payment->id,
            'requested_by' => $admin->id,
            'amount_rials' => 100_000,
            'status' => RefundStatus::Pending,
            'idempotency_key' => hash('sha256', 'admin-panel-refund'),
            'reason' => 'تست',
            'requested_at' => now(),
        ]);
        $shipment = Shipment::factory()->for($order)->create();
        $cart = Cart::factory()->create(['status' => CartStatus::Abandoned, 'abandoned_at' => now()]);

        foreach ([
            "products/{$product->public_id}", "product-variants/{$variant->public_id}", "orders/{$order->public_id}",
            "payments/{$payment->public_id}", "refunds/{$refund->public_id}", "shipments/{$shipment->public_id}",
            "carts/{$cart->public_id}", "users/{$admin->public_id}",
            "products/{$product->public_id}/edit", "product-variants/{$variant->public_id}/edit",
            "shipments/{$shipment->public_id}/edit", "users/{$admin->public_id}/edit",
        ] as $path) {
            $this->assertSame(200, $this->get("/admin/{$path}")->status(), $path);
        }
    }

    public function test_admin_create_command_creates_panel_user(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'مدیر فروشگاه',
            '--email' => 'admin@example.com',
            '--phone' => '09120000000',
            '--password' => 'secure-password',
        ])->assertSuccessful();

        $user = User::query()->where('email', 'admin@example.com')->firstOrFail();
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertTrue($user->canAccessPanel(filament()->getPanel('admin')));
    }

    public function test_admin_create_command_promotes_an_existing_user_found_by_phone(): void
    {
        $customer = User::factory()->create([
            'email' => null,
            'phone' => '09120000000',
        ]);

        $this->artisan('admin:create', [
            '--name' => 'مدیر فروشگاه',
            '--email' => 'admin@example.com',
            '--phone' => '09120000000',
            '--password' => 'secure-password',
        ])->assertSuccessful();

        $customer->refresh();

        $this->assertSame('admin@example.com', $customer->email);
        $this->assertSame(UserRole::Admin, $customer->role);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_admin_create_command_rejects_email_and_phone_from_different_users(): void
    {
        $emailOwner = User::factory()->create([
            'email' => 'admin@example.com',
            'phone' => '09120000000',
        ]);
        $phoneOwner = User::factory()->create([
            'email' => null,
            'phone' => '09120000001',
        ]);

        $this->artisan('admin:create', [
            '--name' => 'مدیر فروشگاه',
            '--email' => $emailOwner->email,
            '--phone' => $phoneOwner->phone,
            '--password' => 'secure-password',
        ])
            ->expectsOutput('ایمیل و شماره موبایل واردشده متعلق به دو حساب متفاوت هستند.')
            ->assertFailed();

        $this->assertSame(UserRole::Customer, $emailOwner->refresh()->role);
        $this->assertSame(UserRole::Customer, $phoneOwner->refresh()->role);
    }
}
