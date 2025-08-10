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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('noSkrd');
            $table->string('no_invoice')->unique();
            $table->integer('jumlah_bulan');
            $table->string('satuan');
            $table->string('nama_bank');
            $table->string('atas_nama');
            $table->string('no_rekening');
            $table->integer('total_retribusi');
            $table->string('terbilang');
            $table->string('file')->nullable();
            $table->date('tanggal_terbit');
            $table->date('jatuh_tempo');
            $table->timestamps();

            $table->foreign('noSkrd')->references('noSkrd')->on('skrd');
            $table->index('noSkrd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
