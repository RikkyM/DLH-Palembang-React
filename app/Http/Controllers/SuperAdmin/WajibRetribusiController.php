<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Exports\WajibRetribusiExport;
use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\SubKategori;
use App\Models\User;
use App\Models\WajibRetribusi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class WajibRetribusiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $kategoriId = $request->get('kategori');
        $subKategoriId = $request->get('sub-kategori');
        $kecamatanId = $request->get('kecamatan');
        $kelurahanId = $request->get('kelurahan');
        $petugasId = $request->get('petugas');

        $query = WajibRetribusi::with(['kategori', 'subKategori', 'kelurahan', 'kecamatan', 'user:id,namaLengkap', 'pemilik', 'uptd'])->where('status', 'Approved');

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
            'datas' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'kategori' => $kategoriId,
                'subKategori' => $subKategoriId,
                'kecamatan' => $kecamatanId,
                'kelurahan' => $kelurahanId,
                'petugas' => $petugasId
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'kecamatanOptions' => $kecamatan,
            'kelurahanOptions' => $kelurahan,
            'petugasOptions' => $petugas
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(new WajibRetribusiExport($request), 'laporan-wajib-retribusi.xlsx');
    }
}
