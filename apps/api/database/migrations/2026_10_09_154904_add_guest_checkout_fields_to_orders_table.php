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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_phone', 20)->nullable()->after('user_id');
            $table->string('customer_email')->nullable()->after('customer_phone');
            $table->char('checkout_idempotency_key', 64)->nullable()->unique()->after('cart_id');
            $table->char('access_token_hash', 64)->nullable()->unique()->after('checkout_idempotency_key');
            $table->index(['customer_phone', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['customer_phone', 'created_at']);
            $table->dropUnique(['checkout_idempotency_key']);
            $table->dropUnique(['access_token_hash']);
            $table->dropColumn([
                'customer_phone',
                'customer_email',
                'checkout_idempotency_key',
                'access_token_hash',
            ]);
        });
    }
};
