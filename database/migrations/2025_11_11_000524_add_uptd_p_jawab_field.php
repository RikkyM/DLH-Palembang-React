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
        Schema::table('skrd', function (Blueprint $table) {
            $table->string('uptd_p_jawab')->nullable()->after('kecamatanObjekRetribusi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skrd', function (Blueprint $table) {
            $table->dropColumn('uptd_p_jawab');
        });
    }
};
