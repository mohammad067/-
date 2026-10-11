<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->string('order_number', 32)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cart_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('status', 30)->default('pending_payment');
            $table->string('payment_status', 30)->default('pending');
            $table->char('currency', 3)->default('IRR');
            $table->unsignedBigInteger('subtotal_rials');
            $table->unsignedBigInteger('discount_rials')->default(0);
            $table->unsignedBigInteger('shipping_rials')->default(0);
            $table->unsignedBigInteger('tax_rials')->default(0);
            $table->unsignedBigInteger('total_rials');
            $table->string('discount_code', 100)->nullable();
            $table->string('shipping_method_code', 100)->nullable();
            $table->string('shipping_method_name')->nullable();
            $table->text('customer_note')->nullable();
            $table->timestamp('placed_at');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['status', 'created_at']);
            $table->index(['payment_status', 'created_at']);
        });

        Schema::create('order_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('recipient_name');
            $table->string('phone', 20);
            $table->string('province', 100);
            $table->string('city', 100);
            $table->string('postal_code', 20)->nullable();
            $table->text('address_line');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['order_id', 'type']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('sku');
            $table->string('product_name');
            $table->string('variant_name');
            $table->unsignedInteger('weight_grams')->nullable();
            $table->unsignedBigInteger('unit_price_rials');
            $table->unsignedSmallInteger('quantity');
            $table->unsignedBigInteger('discount_rials')->default(0);
            $table->unsignedBigInteger('line_total_rials');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'id']);
        });

        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30);
            $table->string('reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['order_id', 'created_at']);
        });

        Schema::create('inventory_reservations', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->string('status', 20)->default('active');
            $table->char('idempotency_key', 64)->unique();
            $table->timestamp('expires_at');
            $table->timestamp('committed_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->unique(['order_id', 'product_variant_id']);
            $table->index(['status', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_reservations');
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('order_addresses');
        Schema::dropIfExists('orders');
    }
};
