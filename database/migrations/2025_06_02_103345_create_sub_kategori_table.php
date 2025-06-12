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
        Schema::create('sub_kategori', function (Blueprint $table) {
            $table->string('kodeSubKategori', 8)->primary();
            $table->string('kodeKategori', 8);
            $table->string('namaSubKategori');
            $table->string('slug');
            $table->integer('tarif')->nullable();
            $table->json('perhitungan')->nullable();
            $table->string('satuan');
            $table->timestamps();

            $table->foreign('kodeKategori')->references('kodeKategori')->on('kategori')->onUpdate('cascade')->onDelete('cascade');
            $table->index('kodeKategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_kategori');
    }
};
