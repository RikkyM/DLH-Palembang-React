<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Exports\WajibRetribusiExport;
use App\Exports\WajibRetribusiPdf;
use App\Exports\WajibRetribusiPdfExport;
use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\SubKategori;
use App\Models\User;
use App\Models\WajibRetribusi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class WajibRetribusiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $kategoriId = $request->get('kategori');
        $subKategoriId = $request->get('sub-kategori');
        $kecamatanId = $request->get('kecamatan');
        $kelurahanId = $request->get('kelurahan');
        $petugasId = $request->get('petugas');

        $allowedPerPage = [10, 25, 50, 100, 250];
        if (!in_array((int) $perPage, $allowedPerPage)) {
            $perPage = 10;
        }

        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ])->where('status', 'Approved');

        if ($search && trim($search) !== '') {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('namaLengkap', 'like', "%{$search}%");
            })
                ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
        }

        if ($kategoriId) {
            $query->whereHas('kategori', function ($q) use ($kategoriId) {
                $q->where('kodeKategori', $kategoriId);
            });
        }

        if ($subKategoriId) {
            $query->whereHas('subKategori', function ($q) use ($subKategoriId) {
                $q->where('kodeSubKategori', $subKategoriId);
            });
        }

        if ($kecamatanId) {
            $query->whereHas('kecamatan', function ($q) use ($kecamatanId) {
                $q->where('kodeKecamatan', $kecamatanId);
            });
        }

        if ($kelurahanId) {
            $query->whereHas('kelurahan', function ($q) use ($kelurahanId) {
                $q->where('kodeKelurahan', $kelurahanId);
            });
        }

        if ($petugasId) {
            $query->whereHas('user', function ($q) use ($petugasId) {
                $q->where('id', $petugasId);
            });
        };

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();

        $subKategori = $kategoriId ? SubKategori::where('kodeKategori', $kategoriId)->select('kodeSubKategori', 'namaSubKategori')->get() : collect();

        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->get();

        $kelurahan = $kecamatanId ? Kelurahan::where('kodeKecamatan', $kecamatanId)->select('kodeKelurahan', 'namaKelurahan')->get() : collect();

        $petugas = User::select('id', 'namaLengkap')->where('role', 'ROLE_PENDAFTAR')->get();

        return Inertia::render('Super-Admin/Laporan/Wajib-Retribusi/Index', [
            'datas' => $query->paginate($perPage)->withQueryString(),
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'kategori' => $kategoriId,
                'subKategori' => $subKategoriId,
                'kecamatan' => $kecamatanId,
                'kelurahan' => $kelurahanId,
                'petugas' => $petugasId,
                'per_page' => $perPage
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'kecamatanOptions' => $kecamatan,
            'kelurahanOptions' => $kelurahan,
            'petugasOptions' => $petugas
        ]);
    }

    public function previewAndDownloadPdf(Request $request)
    {
        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ])->where('status', 'Approved');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($q2) => $q2->where('namaLengkap', 'like', "%{$search}%"))
                    ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($kategori = $request->kategori) {
            $query->whereHas('kategori', fn($q) => $q->where('kodeKategori', $kategori));
        }

        if ($subKategori = $request->{'sub-kategori'}) {
            $query->whereHas('subKategori', fn($q) => $q->where('kodeSubKategori', $subKategori));
        }

        if ($kecamatan = $request->kecamatan) {
            $query->whereHas('kecamatan', fn($q) => $q->where('kodeKecamatan', $kecamatan));
        }

        if ($kelurahan = $request->kelurahan) {
            $query->whereHas('kelurahan', fn($q) => $q->where('kodeKelurahan', $kelurahan));
        }

        if ($petugas = $request->petugas) {
            $query->whereHas(
                'user',
                fn($q) => $q->where('id', $petugas)
            );
        }

        $data = $query->get();

        $pdf = Pdf::loadView('exports.wajib-retribusi-pdf', compact('data'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d-H-i-s') . '.pdf';

        return $pdf->download(
            $fileName
            //  [
            //     'Attachment' => true
            // ]
        );
    }

    public function export(Request $request)
    {
        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new WajibRetribusiExport($request),
            $fileName
        );
    }
}
