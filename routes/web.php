<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\PemohonController;
use App\Http\Controllers\SkrdController;
use App\Http\Controllers\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/sirep/login');

Route::prefix('sirep')->group(function () {
    require __DIR__ . '/auth.php';

    Route::middleware('auth')->group(function () {

        Route::controller(WajibRetribusiController::class)->group(function () {
            Route::get('/wajib-retribusi/download-pdf', 'downloadPdf')->name('wajib-retribusi.download-pdf');
            Route::get('/wajib-retribusi/{id}/draft-retribusi', 'draftPdf')->name('wajib-retribusi.draft-pdf');
            Route::get('/wajib-retribusi/export', 'export')->name('wajib-retribusi.export');
            // Route::get('/wajib-retribusi/{id}/export-single', 'exportSingle')->name('wajib-retribusi.export-single');
            Route::get('/wajib-retribusi/{type}/{filename}', 'getImage')->name('private.file');
        });

        Route::controller(SkrdController::class)->group(function () {
            Route::get('/download-pdf', 'downloadPdf')->name('skrd.download-pdf');
            Route::get('/download-excel', 'downloadExcel')->name('skrd.download-excel');
            Route::get('/{id}/skrd', 'downloadSinglePdf')->name('skrd.download-data-pdf');
            Route::get('/skrd/{filename}', 'previewPdfLocal')->name('skrd.pdf');
            Route::get('/{id}/download-data-excel', 'downloadSingleExcel')->name('skrd.download-data-excel');
        });

        Route::get('/export-pemohon', [PemohonController::class, 'exportPemohon'])->name('export-pemohon');

        Route::controller(FileController::class)->group(function () {
            Route::get('/file/{filename}', 'getBuktiBayar')->where('filename', '.*')->name('bukti-bayar');
            Route::get('/pemohon/{filename}', 'getKtp')->name('getKtp');
        });


        require __DIR__ . '/role/superadmin.php';
        require __DIR__ . '/role/pendaftar.php';
        require __DIR__ . '/role/kuptd.php';
        require __DIR__ . '/role/katim.php';
        require __DIR__ . '/role/kabid.php';
        require __DIR__ . '/role/kasubag.php';
    });
});
