<?php

use App\Http\Controllers\RekapitulasiController;
use App\Http\Controllers\SuperAdmin\AccountController;
use App\Http\Controllers\SuperAdmin\BadanUsahaController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\ImportDataController;
use App\Http\Controllers\SuperAdmin\InvoiceController;
use App\Http\Controllers\SuperAdmin\KategoriController;
use App\Http\Controllers\SuperAdmin\KecamatanController;
use App\Http\Controllers\SuperAdmin\KelurahanController;
use App\Http\Controllers\SuperAdmin\PemohonController;
use App\Http\Controllers\SuperAdmin\PenagihController;
// use App\Http\Controllers\SuperAdmin\RekapitulasiController;
use App\Http\Controllers\SuperAdmin\SetoranController;
use App\Http\Controllers\SuperAdmin\SettingController;
use App\Http\Controllers\SuperAdmin\SkrdController;
use App\Http\Controllers\SuperAdmin\SubKategoriController;
use App\Http\Controllers\SuperAdmin\UptdController;
use App\Http\Controllers\SuperAdmin\UserController;
use App\Http\Controllers\SuperAdmin\WajibRetribusiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('role:ROLE_SUPERADMIN')->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('permohonan')->group(function () {
        Route::resource('/pemohon', PemohonController::class)->only(['index', 'store', 'update']);
        Route::resource('/wajib-retribusi', WajibRetribusiController::class)
            ->except(['destroy', 'edit', 'show'])
            ->parameters([
                'wajib-retribusi' => 'retribusi'
            ]);
    });

    Route::prefix('inbox-data')->group(function () {
        // Route::get('/pemohon/{filename}', [PemohonController::class, 'getKtp'])->name('getKtp');
        Route::controller(WajibRetribusiController::class)->name('wajib-retribusi.')->group(function () {
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
        Route::resource('/skrd', SkrdController::class)->only(['index', 'show']);
    });

    Route::prefix('tagihan')->group(function () {
        Route::resource('/surat-tagihan', InvoiceController::class)
            ->only(['index', 'show', 'store', 'update'])
            ->parameters([
                'surat-tagihan' => 'invoice'
            ]);
        // Route::get('/invoice/pdf/{invoice}', [InvoiceController::class, 'openFile'])->name('invoice.pdf');
        // Route::get('/preview-invoice', [InvoiceController::class, 'previewPdf'])->name('invoice.preview');
    });

    Route::prefix('penerimaan')->group(function () {
        Route::get('/input-setoran', [SetoranController::class, 'create'])->name('input-setoran');
        Route::resource('/data-setoran', SetoranController::class)
            ->only(['index', 'store', 'show'])
            ->parameters([
                'data-setoran' => 'data'
            ])
            ->where(['data' => '.*']);
    });

    Route::prefix('laporan')->name('rekapitulasi.')->group(function () {
        Route::controller(RekapitulasiController::class)->group(function () {
            Route::prefix('/spkrd')->group(function () {
                Route::get('/', 'spkrd')->name('spkrd');
                Route::get('/detail', 'spkrdDetail')
                    ->name('spkrd.detail');
            });
            Route::prefix('/retribusi-kecamatan')->group(function () {
                Route::get('/', 'retribusiKecamatan')->name('retribusi-kecamatan');
                Route::get('/detail', 'detailRetribusiKecamatan')
                    ->name('retribusi-kecamatan.detail');
            });
            Route::prefix('/retribusi-uptd')->group(function () {
                Route::get('/', 'penerimaan')->name('penerimaan');
                Route::get('/detail', 'penerimaanDetail')
                    ->name('penerimaan.detail');
            });
            Route::prefix('/nota-tagihan')->group(function () {
                Route::get('/', 'notaTagihan')->name('nota-tagihan');
            });
        });
    });

    Route::prefix('master-data')->group(function () {
        Route::resource('/uptd', UptdController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/user', UserController::class)->only(['index', 'store', 'update']);
        Route::get('/export-user', [UserController::class, 'exportUser'])->name('export-user');
        Route::get('/penagih/export', [PenagihController::class, 'exportPenagih'])->name('export.penagih');
        Route::resource('/penagih', PenagihController::class)->only(['index', 'store', 'update']);
        Route::resource('/kecamatan', KecamatanController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/kelurahan', KelurahanController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/kategori', KategoriController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/sub-kategori', SubKategoriController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('/badan-usaha', BadanUsahaController::class)->only(['index', 'store', 'update']);
    });

    Route::prefix('setting')->controller(SettingController::class)->group(function () {
        Route::get('/penanda-tangan', 'TandaTangan')->name('penanda-tangan');
        Route::put('/penanda-tangan', 'TandaTanganUpdate')->name('penanda-tangan-update');
        Route::get('/data-instansi', 'dataInstansi')->name('data-instansi');
        Route::get('/informasi', 'informasi')->name('informasi');
    });

    Route::get('/akun', [AccountController::class, 'index'])->name('akun');
    Route::put('/akun', [AccountController::class, 'update'])->name('akun.update');

    Route::get('excel', [SubKategoriController::class, 'importExcelIndex'])->name('excelIndex');
    Route::post('excel', [SubKategoriController::class, 'importExcel'])->name('excel');
    Route::controller(ImportDataController::class)->group(function () {
        Route::get('/pemohon-import', 'importPemohonIndex')->name('pemohon-index');
        Route::post('/pemohon-import', 'importExcelPemohon')->name('pemohon-import');
        Route::get('/retribusi-import', 'importRetribusiIndex')->name('retribusi-index');
        Route::post('/retribusi-import', 'importExcelRetribusi')->name('retribusi-import');
        Route::post('/skrd-import', 'importExcelSkrd')->name('skrd-import');
        Route::get('/setoran-import', 'importSetoranIndex')->name('setoran-index');
        Route::post('/setoran-import', 'importExcelSetoran')->name('setoran-import');
    });
});
