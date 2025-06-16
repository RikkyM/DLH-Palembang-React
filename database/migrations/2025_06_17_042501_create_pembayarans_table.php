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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('skrdId');
            $table->unsignedBigInteger('uptdId');
            $table->unsignedBigInteger('petugasPendaftarId');
            $table->string('noSkrd', 100);
            $table->string('noWajibRetribusi', 50);
            $table->string('noRef', 100);
            $table->timestamp('tanggalBayar')->nullable();
            $table->integer('jumlahBayar');
            $table->integer('jumlahBulanBayar');
            $table->integer('sisaBulan');
            $table->integer('totalBayar');
            $table->integer('deposit');
            $table->integer('lebihBayar')->nullable();
            $table->integer('jumlahTotalBulanTerbayar');
            $table->string('tipePembayaran', 50)->default('transfer');
            $table->json('pembayaranBulan')->nullable();

            $table->string('image_pembayaran', 255)->nullable();
            $table->string('url_image_pembayaran', 500)->nullable();

            $table->string('status', 50)->default('baru');
            $table->json('historyAction');

            $table->timestamps();

            $table->index('skrdId');
            $table->index('uptdId');
            $table->index('petugasPendaftarId');
            $table->index('noWajibRetribusi');
            $table->index('tanggalBayar');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
