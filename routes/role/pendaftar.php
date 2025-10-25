<?php

use App\Http\Controllers\Pendaftar\AccountController;
use App\Http\Controllers\Pendaftar\DashboardController;
use App\Http\Controllers\Pendaftar\PemohonController;
use App\Http\Controllers\Pendaftar\SkrdController;
use App\Http\Controllers\Pendaftar\WajibRetribusiController;
use App\Http\Controllers\RekapitulasiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_PENDAFTAR')->prefix('pendaftar')->name('pendaftar.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('permohonan')->group(function () {
        Route::resource('/pemohon', PemohonController::class)->only(['index', 'store', 'update']);
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)->only(['index', 'create', 'store'])->parameters([
            'wajib-retribusi' => 'retribusi'
        ]);
    });
    Route::prefix('inbox-data')->group(function () {
        Route::name('wajib-retribusi.')->controller(WajibRetribusiController::class)->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/diproses', 'diproses')->name('diproses');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/{status}/{retribusi}/edit', 'edit')
                ->where(['status' => 'diterima|ditolak'])
                ->name('edit');
            Route::put('/{status}/{retribusi}/edit', 'update')
                ->where(['status' => 'diterima|ditolak'])
                ->name('update');
            Route::put('/{id}/send', 'send')->name('send');
        });

        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
    });

    Route::prefix('rekapitulasi')->name('rekapitulasi.')->group(function () {
        Route::controller(RekapitulasiController::class)->group(function () {
            Route::prefix('/spkrd')->group(function () {
                Route::get('/', 'spkrd')->name('spkrd');
                Route::get('/detail', 'spkrdDetail')
                    ->name('spkrd.detail');
            });
            Route::prefix('/penerimaan')->group(function () {
                Route::get('/', 'penerimaan')->name('penerimaan');
                Route::get('/detail', 'penerimaanDetail')
                    ->name('penerimaan.detail');
            });
            Route::prefix('/nota-tagihan')->group(function() {
                Route::get('/', 'notaTagihan')->name('nota-tagihan');
            });
        });
    });

    Route::get('/akun', [AccountController::class, 'index'])->name('akun');
    Route::put('/akun', [AccountController::class, 'update'])->name('akun.update');
});
