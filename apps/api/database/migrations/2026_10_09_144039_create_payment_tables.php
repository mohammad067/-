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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignId('order_id')->constrained()->restrictOnDelete();
            $table->string('gateway', 50);
            $table->string('status', 30)->default('pending');
            $table->unsignedBigInteger('amount_rials');
            $table->char('currency', 3)->default('IRR');
            $table->char('idempotency_key', 64)->unique();
            $table->string('authority')->nullable();
            $table->string('gateway_transaction_id')->nullable();
            $table->text('redirect_url')->nullable();
            $table->string('failure_code', 100)->nullable();
            $table->text('failure_message')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status', 'created_at']);
            $table->unique(['gateway', 'authority']);
            $table->unique(['gateway', 'gateway_transaction_id']);
        });

        Schema::create('payment_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->string('gateway', 50);
            $table->string('event_id');
            $table->char('payload_hash', 64);
            $table->json('headers')->nullable();
            $table->longText('payload');
            $table->char('signature_hash', 64)->nullable();
            $table->string('status', 20)->default('received');
            $table->text('error_message')->nullable();
            $table->timestamp('received_at');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->unique(['gateway', 'event_id']);
            $table->index(['status', 'received_at']);
        });

        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('amount_rials');
            $table->string('status', 30)->default('pending');
            $table->char('idempotency_key', 64)->unique();
            $table->string('gateway_refund_id')->nullable()->unique();
            $table->text('reason')->nullable();
            $table->timestamp('requested_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['payment_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('payment_webhook_events');
        Schema::dropIfExists('payments');
    }
};
