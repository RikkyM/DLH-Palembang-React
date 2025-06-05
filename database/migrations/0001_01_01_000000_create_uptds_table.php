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
        Schema::create('uptd', function (Blueprint $table) {
            $table->id();
            $table->string('namaUptd');
            $table->text('alamat');
            $table->string('kodeKecamatan', 8);
            $table->timestamps();

            $table->foreign('kodeKecamatan')->references('kodeKecamatan')->on('kecamatan')->onUpdate('cascade')->onDelete('cascade');
            $table->index('kodeKecamatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uptd');
    }
};
