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
        Schema::table('carts', function (Blueprint $table) {
            $table->timestamp('abandoned_at')->nullable()->after('last_activity_at');
            $table->timestamp('recovered_at')->nullable()->after('abandoned_at');
            $table->timestamp('reminder_sent_at')->nullable()->after('recovered_at');
            $table->index(['status', 'last_activity_at'], 'carts_status_activity_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropIndex('carts_status_activity_index');
            $table->dropColumn(['abandoned_at', 'recovered_at', 'reminder_sent_at']);
        });
    }
};
