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
        Schema::create('skrd', function (Blueprint $table) {
            $table->id();
            $table->string('noSkrd')->nullable()->unique();
            $table->bigInteger('nomorOnly')->nullable();
            $table->foreignId('uptdId')->constrained('uptd');
            $table->string('namaPendaftar')->nullable();
            $table->string('noWajibRetribusi');
            $table->string('namaObjekRetribusi');
            $table->foreignId('pemilikId')->nullable()->constrained('pemilik');
            $table->text('deskripsiUsaha')->nullable();
            $table->string('kelurahanObjekRetribusi')->nullable();
            $table->string('kecamatanObjekRetribusi');
            $table->string('alamatObjekRetribusi');
            $table->string('namaKategori');
            $table->string('namaSubKategori');
            $table->integer('jumlahBulan');
            $table->string('keteranganBulan')->nullable();
            $table->date('tanggalSkrd')->nullable();
            $table->integer('tagihanPerBulanSkrd');
            $table->integer('tagihanPerTahunSkrd');
            $table->string('tarifPerBulanObjekRetribusi');
            $table->string('tarifPerTahunObjekRetribusi');
            $table->string('terbilangTahun');
            $table->string('terbilangBulan');
            $table->string('latitudeObjekRetribusi')->nullable();
            $table->string('longitudeObjekRetribusi')->nullable();
            $table->string('tahun');
            $table->foreignId('objekRetribusiId')->constrained('wajib_retribusi');
            $table->string('statusSkrd');
            $table->json('historyAction')->nullable();
            $table->string('fileSkrd')->nullable();
            $table->json('url_fileSkrd')->nullable();
            $table->string('image')->nullable();
            $table->json('url_image')->nullable();
            $table->timestamps();
            $table->string('varetribusi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skrd');
    }
};
