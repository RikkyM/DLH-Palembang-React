<?php

use App\Http\Controllers\Pendaftar\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_PENDAFTAR')->prefix('pendaftar')->name('pendaftar.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
