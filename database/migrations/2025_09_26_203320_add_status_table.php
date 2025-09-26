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
        Schema::table('setoran', function (Blueprint $table) {
            $table->after('buktiBayar', function (Blueprint $table) {
                $table->enum('status', ['Processed', 'Approved', 'Rejected'])->default('Processed');
                $table->enum('current_stage', ['kasubbag', 'kuptd', 'bendahara'])->default('kasubbag');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('setoran', function (Blueprint $table) {
            $table->dropColumn(['status', 'current_stage']);
        });
    }
};
