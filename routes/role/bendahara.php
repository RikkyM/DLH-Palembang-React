<?php

use App\Http\Controllers\Bendahara\AccountController;
use App\Http\Controllers\Bendahara\DashboardController;
use App\Http\Controllers\Bendahara\InvoiceController;
use App\Http\Controllers\Bendahara\SetoranController;
use App\Http\Controllers\Bendahara\SkrdController;
use App\Http\Controllers\RekapitulasiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_BENDAHARA')->prefix('bendahara')->name('bendahara.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/inbox-data/skrd', SkrdController::class)->only(['index', 'show']);
    Route::resource('/tagihan/surat-tagihan', InvoiceController::class)
        ->only(['index', 'show'])
        ->parameters([
            'surat-tagihan' => 'invoice'
        ]);
    Route::put('/penerimaan/data-setoran/{nota}/cancel', [SetoranController::class, 'batalSetoran'])
        ->where(['nota' => '.*'])
        ->name('data-setoran.cancel');
    Route::resource('/penerimaan/data-setoran', SetoranController::class)
        ->only(['index', 'show'])
        ->parameters([
            'data-setoran' => 'data'
        ])
        ->where(['data' => '.*']);
    Route::put('/penerimaan/data-setoran', [SetoranController::class, 'update'])
        ->name('data-setoran.update');

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
            Route::prefix('/nota-tagihan')->group(function () {
                Route::get('/', 'notaTagihan')->name('nota-tagihan');
            });
        });
    });

    Route::get('/akun', [AccountController::class, 'index'])->name('akun');
    Route::put('/akun', [AccountController::class, 'update'])->name('akun.update');
});
