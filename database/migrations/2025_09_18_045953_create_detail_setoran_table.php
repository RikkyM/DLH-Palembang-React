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
        Schema::create('detail_setoran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skrdId')->constrained('skrd')->onUpdate('cascade');
            $table->string('nomorNota');
            $table->string('namaBulan');
            $table->date('tanggalBayar');
            $table->integer('jumlahBayar');
            $table->string('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('nomorNota')->references('nomorNota')->on('setoran')->onUpdate('cascade')->onDelete('cascade');
            $table->index(['skrdId', 'namaBulan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_setoran');
    }
};
