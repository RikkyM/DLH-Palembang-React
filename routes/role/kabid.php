<?php

use App\Http\Controllers\Kabid\DashboardController;
use App\Http\Controllers\Kabid\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KABID')->prefix('kabid')->name('kabid.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('data-input')->group(function() {
        Route::resource('/wajib-retribusi', WajibRetribusiController::class);
    });
});