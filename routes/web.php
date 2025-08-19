<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/sirep/login');

Route::prefix('sirep')->group(function () {
    require __DIR__ . '/auth.php';

    Route::middleware('auth')->group(function () {

        Route::controller(WajibRetribusiController::class)->group(function () {
            Route::get('/wajib-retribusi/download-pdf', 'downloadPdf')->name('wajib-retribusi.download-pdf');
            Route::get('/wajib-retribusi/{id}/draft-pdf', 'draftPdf')->name('wajib-retribusi.draft-pdf');
            Route::get('/wajib-retribusi/export', 'export')->name('wajib-retribusi.export');
            // Route::get('/wajib-retribusi/{id}/export-single', 'exportSingle')->name('wajib-retribusi.export-single');
        });

        require __DIR__ . '/role/superadmin.php';
        require __DIR__ . '/role/pendaftar.php';
        require __DIR__ . '/role/kuptd.php';
    });
});
