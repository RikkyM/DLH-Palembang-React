<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\UptdController;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/sirep/login');

Route::prefix('sirep')->group(function () {
    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::post('/login', [AuthController::class, 'loginProcess'])->name('login.process');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::name('super-admin.')->group(function() {
        Route::controller(SuperAdminDashboardController::class)->group(function () {
            Route::get('/dashboard', 'index')->name('dashboard');
        });
    
        Route::prefix('settings')->group(function () {
            Route::controller(UptdController::class)->group(function () {
                Route::get('/uptd', 'index')->name('uptd');
                Route::post('/uptd', 'store')->name('uptd.store');
                Route::put('/uptd/{uptd}', 'update')->name('uptd.update');
            });
        });
    });
});

// ===================================================

Route::get('/kategori', function () {
    $kategori = Kategori::create(['namaKategori' => 'test kategori', 'slug' => 'test-kategori']);
    return $kategori;
});

Route::get('/kecamatan', function () {
    $kecamatan = Kecamatan::create(['namaKecamatan' => 'test kecamatan', 'slug' => 'test-kecamatan']);
    return $kecamatan;
});

Route::get('/kelurahan', function () {
    $kelurahan = Kelurahan::create(['kodeKecamatan' => '01', 'namaKelurahan' => 'test', 'slug' => 'tefasfast']);
    return $kelurahan;
});

Route::get('/time', function () {
    $user = User::first();

    // $date = Carbon::parse($user->historyLogin);

    // $laravelFormat = $date->utc()->format('Y-m-d\TH:i:s.u\Z');

    return $user;
});
