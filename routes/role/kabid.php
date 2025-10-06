<?php

use App\Http\Controllers\Kabid\DashboardController;
use App\Http\Controllers\Kabid\SkrdController;
use App\Http\Controllers\Kabid\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KABID')->prefix('kabid')->name('kabid.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('permohonan')->group(function () {
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)->except(['edit', 'show', 'destroy'])->parameters([
            'wajib-retribusi' => 'retribusi'
        ]);
    });
    Route::prefix('inbox-data')->group(function () {
        Route::name('wajib-retribusi.')->controller(WajibRetribusiController::class)->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/{status}/{retribusi}/show', 'show')
                ->where(['status' => 'diterima|ditolak'])
                ->name('show');
            Route::post('/{retribusi}/create-skrd', 'createSkrd')->name('create-skrd');
        });

        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
    });
});
