<?php

use App\Http\Controllers\Kuptd\DashboardController;
use App\Http\Controllers\Kuptd\SkrdController;
use App\Http\Controllers\Kuptd\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KUPTD')->prefix('kuptd')->name('kuptd.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('data-input')->group(function () {
        Route::prefix('wajib-retribusi')->name('wajib-retribusi.')->controller(WajibRetribusiController::class)->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/diproses', 'diproses')->name('diproses');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/{status}/{retribusi}/show', 'show')
            ->where(['status' => 'diterima|diproses|ditolak'])
            ->name('show');
        });
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)->except(['edit', 'show', 'destroy'])->parameters([
            'wajib-retribusi' => 'retribusi'
        ]);
        Route::resource('/skrd', SkrdController::class);
    });
});
