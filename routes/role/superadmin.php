<?php

use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\InvoiceController;
use App\Http\Controllers\SuperAdmin\KategoriController;
use App\Http\Controllers\SuperAdmin\KecamatanController;
use App\Http\Controllers\SuperAdmin\KelurahanController;
use App\Http\Controllers\SuperAdmin\PemohonController;
use App\Http\Controllers\SuperAdmin\PenerimaanRetribusiController;
use App\Http\Controllers\SuperAdmin\SkrdController;
use App\Http\Controllers\SuperAdmin\SubKategoriController;
use App\Http\Controllers\SuperAdmin\UptdController;
use App\Http\Controllers\SuperAdmin\UserController;
use App\Http\Controllers\SuperAdmin\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_SUPERADMIN')->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('data-input')->group(function () {
        Route::resource('/pemohon', PemohonController::class)->only(['index', 'store', 'update']);
        Route::controller(WajibRetribusiController::class)->group(function () {
            Route::get('/wajib-retribusi', 'index')->name('wajib-retribusi.index');
            Route::get('/wajib-retribusi/diterima', 'diterima')->name('wajib-retribusi-diterima');
            Route::get('/wajib-retribusi/diproses', 'diproses')->name('wajib-retribusi-diproses');
            Route::get('/wajib-retribusi/ditolak', 'ditolak')->name('wajib-retribusi-ditolak');
            Route::get('/wajib-retribusi/tambah-data-wajib-retribusi', 'create')->name('wajib-retribusi.create');
            Route::post('/wajib-retribusi/store', 'store')->name('wajib-retribusi.store');
            Route::get('/wajib-retribusi/edit-data-wajib-retribusi/{retribusi}', 'edit')->name('wajib-retribusi.edit');
            Route::put('/wajib-retribusi/update/{id}', 'update')->name('wajib-retribusi.update');
            Route::put('/wajib-retribusi/{id}/send-diterima', 'sendDiterima')->name('wajib-retribusi.send-diterima');
            Route::get('/wajib-retribusi/download-pdf', 'downloadPdf')->name('wajib-retribusi.download-pdf');
            Route::get('/wajib-retribusi/export', 'export')->name('wajib-retribusi.export');
            Route::get('/wajib-retribusi/{id}/export-single', 'exportSingle')->name('wajib-retribusi.export-single');
        });
        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
        
    });

    Route::prefix('pembayaran')->group(function () {
        Route::resource('/invoice', InvoiceController::class)->only(['index', 'show', 'store', 'update']);
        Route::get('/invoice/pdf/{filename}', [InvoiceController::class, 'openFile'])->name('invoice.pdf');
        Route::get('/preview-invoice', [InvoiceController::class, 'previewPdf'])->name('invoice.preview'); // route ini digunakan untuk preview invoice saja tidak terlalu digunakan
        Route::resource('/penerimaan-retribusi', PenerimaanRetribusiController::class);
    });

    Route::prefix('settings')->group(function () {
        Route::resource('/uptd', UptdController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/user', UserController::class)->only(['index', 'store', 'update']);
        Route::resource('/kecamatan', KecamatanController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/kelurahan', KelurahanController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/kategori', KategoriController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/sub-kategori', SubKategoriController::class)->only(['index', 'store', 'update', 'destroy']);
    });


    Route::get('excel', [SubKategoriController::class, 'importExcelIndex'])->name('excelIndex');
    Route::post('excel', [SubKategoriController::class, 'importExcel'])->name('excel');
});
