<?php

use App\Http\Controllers\Kasubag\DashboardController;
use App\Http\Controllers\Kasubag\SetoranController;
use App\Http\Controllers\Kasubag\SkrdController;
use App\Http\Controllers\Kasubag\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KASUBAG_TU_UPDT')->prefix('kasubag')->name('kasubag.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('permohonan')->group(function () {
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)
            ->only(['index'])
            ->parameters([
                'wajib-retribusi' => 'retribusi'
            ]);
    });

    Route::prefix('inbox-data')->group(function () {
        Route::name('wajib-retribusi.')->controller(WajibRetribusiController::class)->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/diproses', 'diproses')->name('diproses');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/{status}/{retribusi}/show', 'show')
                ->where(['status' => 'diterima|diproses|ditolak'])
                ->name('show');
        });

        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
    });

    Route::prefix('penerimaan')->group(function () {
        Route::get('/input-setoran', [SetoranController::class, 'create'])->name('input-setoran');
        Route::resource('/data-setoran', SetoranController::class)
            ->only(['index', 'store', 'show'])
            ->parameters([
                'data-setoran' => 'data'
            ])
            ->where(['data' => '.*']);
    });
});
