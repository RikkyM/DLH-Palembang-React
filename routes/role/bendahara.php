<?php

use App\Http\Controllers\Bendahara\DashboardController;
use App\Http\Controllers\Bendahara\InvoiceController;
use App\Http\Controllers\Bendahara\SetoranController;
use App\Http\Controllers\Bendahara\SkrdController;
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
});
