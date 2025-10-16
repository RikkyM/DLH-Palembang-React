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
        Schema::create('pemilik', function (Blueprint $table) {
            $table->id();
            $table->string('kodeKecamatan', 8);
            $table->string('kodeKelurahan', 8);
            $table->string('namaPemilik');
            $table->string('jabatan')->nullable();
            $table->string('nik')->unique()->nullable();
            $table->string('alamat');
            $table->string('tempatLahir')->nullable();
            $table->date('tanggalLahir')->nullable();
            $table->string('email')->nullable();
            $table->string('noHP')->nullable();
            $table->string('ktp')->nullable();
            $table->timestamps();

            $table->foreign('kodeKelurahan')->references('kodeKelurahan')->on('kelurahan')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('kodeKecamatan')->references('kodeKecamatan')->on('kecamatan')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemilik');
    }
};
