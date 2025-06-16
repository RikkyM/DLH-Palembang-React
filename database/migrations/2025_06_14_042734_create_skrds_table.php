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
            $table->foreignId('uptdId')->constrained('uptd')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('petugasPendaftarId')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('noWajibRetribusi');
            $table->string('namaObjekRetribusi');
            $table->foreignId('pemilikId')->constrained('pemilik')->onUpdate('cascade')->onDelete('cascade');
            $table->text('deskripsiUsaha');
            $table->string('kelurahanObjekRetribusi');
            $table->string('kecamatanObjekRetribusi');
            $table->string('alamatObjekRetribusi');
            $table->string('namaKategori');
            $table->string('namaSubKategori');
            $table->integer('jumlahBulan');
            $table->integer('tagihanPerBulanSkrd');
            $table->integer('tagihanPerTahunSkrd');
            $table->string('tarifPerBulanObjekRetribusi');
            $table->string('tarifPerTahunObjekRetribusi');
            $table->string('terbilangTahun');
            $table->string('terbilangBulan');
            $table->string('latitudeObjekRetribusi');
            $table->string('longtitudeObjekRetribusi');
            $table->string('tahun');
            $table->foreignId('objekRetribusiId')->constrained('wajib_retribusi')->onUpdate('cascade')->onDelete('cascade');
            $table->string('statusSkrd');
            $table->json('historyAction');
            $table->string('fileSkrd')->nullable();
            $table->string('url_fileSkrd')->nullable();
            $table->string('image');
            $table->string('url_image');
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
