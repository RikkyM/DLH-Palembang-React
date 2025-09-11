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
        Schema::table('wajib_retribusi', function (Blueprint $table) {
            $table->string('noSkrd')->nullable()->unique()->after('noWajibRetribusi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wajib_retribusi', function (Blueprint $table) {
            $table->dropColumn('noSkrd');
        });
    }
};
