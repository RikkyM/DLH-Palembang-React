<?php

use App\Http\Controllers\SuperAdmin\BadanUsahaController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\InvoiceController;
use App\Http\Controllers\SuperAdmin\KategoriController;
use App\Http\Controllers\SuperAdmin\KecamatanController;
use App\Http\Controllers\SuperAdmin\KelurahanController;
use App\Http\Controllers\SuperAdmin\PemohonController;
use App\Http\Controllers\SuperAdmin\PenagihController;
use App\Http\Controllers\SuperAdmin\PenerimaanRetribusiController;
use App\Http\Controllers\SuperAdmin\SetoranController;
use App\Http\Controllers\SuperAdmin\SkrdController;
use App\Http\Controllers\SuperAdmin\SubKategoriController;
use App\Http\Controllers\SuperAdmin\UptdController;
use App\Http\Controllers\SuperAdmin\UserController;
use App\Http\Controllers\SuperAdmin\WajibRetribusiController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ROLE_SUPERADMIN')->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('data-input')->group(function () {
        // Route::get('/pemohon/{filename}', [PemohonController::class, 'getKtp'])->name('getKtp');
        Route::resource('/pemohon', PemohonController::class)->only(['index', 'store', 'update']);
        Route::controller(WajibRetribusiController::class)->name('wajib-retribusi.')->prefix('wajib-retribusi')->group(function () {
            Route::get('/diterima', 'diterima')->name('diterima');
            Route::get('/diproses', 'diproses')->name('diproses');
            Route::get('/ditolak', 'ditolak')->name('ditolak');
            Route::get('/{status}/{retribusi}/edit', 'edit')
                ->where(['status' => 'diterima|ditolak'])
                ->name('edit');
            Route::get('/{status}/{retribusi}/show', 'show')
                ->where(['status' => 'diterima|diproses|ditolak'])
                ->name('show');
            Route::put('/{id}/send', 'send')->name('send');
        });
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)
            ->except(['destroy', 'edit', 'show'])
            ->parameters([
                'wajib-retribusi' => 'retribusi'
            ]);
        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
    });

    Route::prefix('setoran')->group(function () {
        Route::resource('/invoice', InvoiceController::class)->only(['index', 'show', 'store', 'update']);
        // Route::get('/invoice/pdf/{filename}', [InvoiceController::class, 'openFile'])->name('invoice.pdf');
        Route::get('/invoice/pdf/{invoice}', [InvoiceController::class, 'openFile'])->name('invoice.pdf');
        Route::get('/preview-invoice', [InvoiceController::class, 'previewPdf'])->name('invoice.preview'); // route ini digunakan untuk preview invoice saja tidak terlalu digunakan
        Route::resource('/penerimaan-retribusi', PenerimaanRetribusiController::class);
        // Route::resource('/input-setoran', SetoranController::class)->only(['index', 'create']);
        Route::get('/input-setoran', [SetoranController::class, 'create'])->name('input-setoran');
        Route::resource('/data-setoran', SetoranController::class)->only(['index', 'store']);
    });

    Route::prefix('master-data')->group(function () {
        Route::resource('/uptd', UptdController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/user', UserController::class)->only(['index', 'store', 'update']);
        Route::resource('/penagih', PenagihController::class)->only(['index', 'store', 'update']);
        Route::resource('/kecamatan', KecamatanController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/kelurahan', KelurahanController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/kategori', KategoriController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/sub-kategori', SubKategoriController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/badan-usaha', BadanUsahaController::class)->only(['index', 'store', 'update']);
    });


    Route::get('excel', [SubKategoriController::class, 'importExcelIndex'])->name('excelIndex');
    Route::post('excel', [SubKategoriController::class, 'importExcel'])->name('excel');
    Route::get('/export-username', [DashboardController::class, 'exportUserCSV']);
    Route::get('/export-user-pdf', [DashboardController::class, 'exportUserPdf']);
});
