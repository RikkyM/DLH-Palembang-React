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
            // $table->foreignId('penagihId')->nullable()->after('pemilikId')->constrained('penagih');
            $table->string('namaPenagih')->nullable()->after('pemilikId');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skrd', function (Blueprint $table) {
            // $table->dropForeign(['penagihId']);
            $table->dropColumn('namaPenagih');
        });
    }
};
