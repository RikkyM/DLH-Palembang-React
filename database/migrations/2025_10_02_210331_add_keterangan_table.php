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
            $table->after('current_stage', function (Blueprint $table) {
                $table->string('keterangan')->nullable();
                $table->datetime('tanggal_diterima')->nullable();
                $table->datetime('tanggal_batal')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('setoran', function (Blueprint $table) {
            $table->dropColumn(['keterangan', 'tanggal_diterima', 'tanggal_batal']);
        });
    }
};
