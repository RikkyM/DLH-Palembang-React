<?php

use App\Http\Controllers\Katim\AccountController;
use App\Http\Controllers\Katim\DashboardController;
use App\Http\Controllers\Katim\SkrdController;
use App\Http\Controllers\Katim\WajibRetribusiController;
use App\Http\Controllers\RekapitulasiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KATIM')->prefix('katim')->name('katim.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('permohonan')->group(function () {
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)->except(['edit', 'show', 'destroy'])->parameters([
            'wajib-retribusi' => 'retribusi'
        ]);
    });
    Route::prefix('inbox-data')->group(function () {
        Route::name('wajib-retribusi.')->controller(WajibRetribusiController::class)->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/diproses', 'diproses')->name('diproses');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/selesai', 'selesai')->name('selesai');
            Route::get('/{status}/{retribusi}/show', 'show')
                ->where(['status' => 'diterima|diproses|ditolak|selesai'])
                ->name('show');
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
