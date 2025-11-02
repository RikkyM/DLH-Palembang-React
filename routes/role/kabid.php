<?php

use App\Http\Controllers\Kabid\AccountController;
use App\Http\Controllers\Kabid\DashboardController;
use App\Http\Controllers\Kabid\SkrdController;
use App\Http\Controllers\Kabid\WajibRetribusiController;
use App\Http\Controllers\RekapitulasiController;
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

    Route::prefix('laporan')->name('rekapitulasi.')->group(function () {
        Route::controller(RekapitulasiController::class)->group(function () {
            Route::prefix('/spkrd')->group(function () {
                Route::get('/', 'spkrd')->name('spkrd');
                Route::get('/detail', 'spkrdDetail')
                ->name('spkrd.detail');
            });
            Route::prefix('/retribusi-kecamatan')->group(function () {
                Route::get('/', 'retribusiKecamatan')->name('retribusi-kecamatan');
                Route::get('/detail', 'detailRetribusiKecamatan')
                ->name('retribusi-kecamatan.detail');
            });
            Route::prefix('/retribusi-uptd')->group(function () {
                Route::get('/', 'penerimaan')->name('penerimaan');
                Route::get('/detail', 'penerimaanDetail')
                ->name('penerimaan.detail');
            });
            Route::prefix('/nota-tagihan')->group(function () {
                Route::get('/', 'notaTagihan')->name('nota-tagihan');
            });
        });
    });

    Route::get('/akun', [AccountController::class, 'index'])->name('akun');
    Route::put('/akun', [AccountController::class, 'update'])->name('akun.update');
});
