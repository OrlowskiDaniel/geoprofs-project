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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('leave_type_id')->constrained('leave_types');
            $table->foreignId('status_id')->constrained('leave_statuses');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('reason');
            $table->integer('number_of_days');
            $table->string('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('personal_leave')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
