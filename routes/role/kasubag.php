<?php

use App\Http\Controllers\Kasubag\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_KASUBAG_TU_UPDT')->prefix('kasubag')->name('kasubag.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
