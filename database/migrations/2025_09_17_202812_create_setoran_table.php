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
        Schema::create('setoran', function (Blueprint $table) {
            $table->string('nomorNota')->primary();
            $table->foreignId('skrdId')->constrained('skrd');
            $table->string('noRef')->nullable();
            $table->date('tanggalBayar');
            $table->integer('jumlahBayar');
            $table->string('namaPenyetor')->nullable();
            $table->string('keteranganBulan')->nullable();
            $table->string('buktiBayar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setoran');
    }
};
