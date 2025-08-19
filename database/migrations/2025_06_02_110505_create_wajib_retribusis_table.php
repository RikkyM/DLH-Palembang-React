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
        Schema::create('wajib_retribusi', function (Blueprint $table) {
            $table->id();
            $table->string('noPendaftaran');
            $table->string('noWajibRetribusi')->nullable();
            $table->string('kodeKategori');
            $table->string('kodeSubKategori');
            $table->string('kodeKelurahan');
            $table->string('kodeKecamatan');
            $table->foreignId('uptdId')->constrained('uptd')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('pemilikId')->constrained('pemilik')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('petugasPendaftarId');
            $table->string('namaObjekRetribusi');
            $table->text('deskripsiUsaha');
            $table->string('bentukBadanUsaha');
            $table->text('alamat');
            $table->string('rt');
            $table->string('rw');
            $table->string('kota');
            $table->string('provinsi');
            $table->string('statusTempat');
            $table->string('latitude');
            $table->string('longitude');
            $table->string('image');
            $table->json('url_image');
            $table->string('file');
            $table->json('url_file');
            $table->string('linkMap')->nullable();
            $table->integer('tarifPerbulan');
            $table->integer('jumlahBangunan');
            $table->integer('jumlahLantai');
            $table->string('maksud');
            $table->string('keterangan')->nullable();
            $table->string('status');
            $table->string('current_role')->nullable();
            $table->string('createdThisYear');
            $table->json('historyAction');
            $table->timestamps();

            $table->foreign('kodeKategori')->references('kodeKategori')->on('kategori')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('kodeSubKategori')->references('kodeSubKategori')->on('sub_kategori')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('kodeKelurahan')->references('kodeKelurahan')->on('kelurahan')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('kodeKecamatan')->references('kodeKecamatan')->on('kecamatan')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('petugasPendaftarId')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wajib_retribusi');
    }
};
