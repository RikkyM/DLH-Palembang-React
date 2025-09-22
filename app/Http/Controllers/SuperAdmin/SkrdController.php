<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Skrd;
use App\Models\SubKategori;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SkrdController extends Controller
{

    private function getBulan()
    {
        Carbon::setLocale('id');

        return collect(range(1, 12))
            ->map(function ($i) {
                return strtoupper(Carbon::create()->month($i)->translatedFormat('F'));
            });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'desc');
        $kategoriId = $request->get('kategori');
        $subKategoriId = $request->get('sub-kategori');
        $petugasId = $request->get('petugas');
        $status = $request->get('status');
        $getBulan = $request->get('bulan');
        $getTahun = $request->get('tahun');
        $getPage = $request->get('per_page', 10);

        $skrd = Skrd::with([
            'user:id,namaLengkap,lokasi',
            'pembayaran',
            'setoran',
            'detailSetoran' => function ($q) {
                $q->orderBy('tanggalBayar');
            }
        ])
            ->select([
                'id',
                'noSkrd',
                'noWajibRetribusi',
                'namaObjekRetribusi',
                'alamatObjekRetribusi',
                "kelurahanObjekRetribusi",
                "kecamatanObjekRetribusi",
                "deskripsiUsaha",
                "tagihanPerBulanSkrd",
                "tagihanPerTahunSkrd",
                'namaKategori',
                'namaSubKategori',
                'namaPendaftar',
                'created_at',
                'fileSkrd'
            ])
            ->addSelect([
                'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                    ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                    ->whereColumn('skrdId', 'skrd.id'),
                'setoran_sum_jumlah' => DB::table('setoran')
                    ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                    ->whereColumn('skrdId', 'skrd.id')
            ]);

        // dd($skrd->where('noSkrd', 'asd/DLH/2025')->first());
        $paidEfektif = "CASE WHEN COALESCE(pembayaran_sum_jumlah_bayar,0) > 0
                    THEN COALESCE(pembayaran_sum_jumlah_bayar,0)
                    ELSE COALESCE(setoran_sum_jumlah,0)
                    END";

        // if ($sortBy === 'sisa_tertagih') {
        //     $skrd->orderByRaw("(tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) {$sortDir}");
        // } elseif ($sortBy === 'statusLunas') {
        //     $skrd->orderByRaw("CASE WHEN (tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) = 0 THEN 0 ELSE 1 END {$sortDir}");
        // } else {
        //     $skrd->orderBy($sortBy, $sortDir);
        // }
        if ($sortBy === 'sisa_tertagih') {
            $skrd->orderByRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) {$sortDir}");
        } elseif ($sortBy === 'statusLunas') {
            // 0 untuk lunas, 1 untuk belum lunas
            $skrd->orderByRaw("CASE WHEN (tagihanPerTahunSkrd - ({$paidEfektif})) = 0 THEN 0 ELSE 1 END {$sortDir}");
        } else {
            $skrd->orderBy($sortBy, $sortDir);
        }

        if ($search && trim($search) !== '') {
            $skrd->where('namaObjekRetribusi', 'like', "%{$search}%");
        }
        if ($kategoriId) {
            $skrd->where('namaKategori', $kategoriId);
        }
        if ($subKategoriId) {
            $skrd->where('namaSubKategori', $subKategoriId);
        }
        if ($petugasId) {
            $skrd->where('namaPendaftar', $petugasId);
        }

        // if ($status === 'lunas') {
        //     $skrd->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) = 0');
        //     // dd($skrd);
        // } elseif ($status === 'belum_lunas') {
        //     $skrd->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) > 0');
        // }

        if ($status === 'lunas') {
            $skrd->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) = 0");
        } elseif ($status === 'belum_lunas') {
            $skrd->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) > 0");
        }

        if ($getBulan) {
            $skrd->whereMonth('created_at', (int) $getBulan);
        }

        if ($getTahun) {
            $skrd->whereYear('created_at', (int) $getTahun);
        }

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $kategoriId ?
            SubKategori::whereHas('kategori', function ($query) use ($kategoriId) {
                $query->where('namaKategori', $kategoriId);
            })->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();
        $petugas = User::select('id', 'namaLengkap', 'lokasi')->where('role', 'ROLE_PENDAFTAR')->orderBy('namaLengkap')->get();

        $tahunOptions = Skrd::selectRaw('YEAR(created_at) as tahun')
            ->distinct()->orderByDesc('tahun')->pluck('tahun');

        $datas = $getPage <= 0 ? $skrd->get() : $skrd->paginate($getPage)->withQueryString();

        return Inertia::render('Super-Admin/Data-Input/Skrd/Index', [
            'datas' => $datas,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'kategori' => $kategoriId,
                'subKategori' => $subKategoriId,
                'petugas' => $petugasId,
                'status' => $status,
                'bulan' => $getBulan,
                'tahun' => $getTahun,
                'per_page' => $getPage
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'petugasOptions' => $petugas,
            'bulan' => $this->getBulan(),
            'tahunOptions' => $tahunOptions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Skrd $skrd)
    {

        return Inertia::render('Super-Admin/Data-Input/Skrd/Show/Index', [
            'data' => $skrd->load(['user', 'pembayaran', 'pemilik', 'uptd', 'setoran', 'detailSetoran.setoran']),
            'bulan' => $this->getBulan()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // public function downloadPdf(Request $request)
    // {
    //     $query = Skrd::query()
    //         ->with(['user:id,namaLengkap,lokasi', 'pembayaran', 'uptd'])
    //         ->addSelect([
    //             'skrd.*',
    //             'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
    //                 ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
    //                 ->whereColumn('skrdId', 'skrd.id')
    //         ]);

    //     if ($search = $request->search) {
    //         $query->where('namaObjekRetribusi', 'like', "%{$search}%");
    //     }

    //     if ($kategori = $request->kategori) {
    //         $query->where('namaKategori', $kategori);
    //     }

    //     if ($subKategori = $request->{'sub-kategori'}) {
    //         $query->where('subKategori', $subKategori);
    //     }

    //     if ($petugas = $request->petugas) {
    //         $query->whereHas('user', fn($q) => $q->where('id', $petugas));
    //     }

    //     if ($status = $request->status) {
    //         if ($status === 'lunas') {
    //             $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) = 0');
    //         } elseif ($status === 'belum_lunas') {
    //             $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) > 0');
    //         }
    //     }

    //     $data = $query->get();

    //     $pdf = Pdf::loadView('exports.skrd.skrd-pdf', compact('data'))
    //         ->setPaper('a4', 'landscape')
    //         ->setOptions([
    //             'dpi' => 150,
    //             'defaultFont' => 'sans-serif',
    //             'isHtml5ParserEnabled' => true,
    //             'isPhpEnabled' => true,
    //             'isRemoteEnabled' => true,
    //             'chroot' => realpath("")
    //         ]);

    //     $fileName = 'laporan-skrd-' . date('Y-m-d-H-i-s') . '.pdf';

    //     return $pdf->download($fileName);
    // }

    // public function downloadExcel(Request $request)
    // {
    //     $fileName = 'laporan-skrd-' . date('Y-m-d') . '.xlsx';

    //     return Excel::download(
    //         new SkrdDataExport($request),
    //         $fileName
    //     );
    // }

    // public function downloadSinglePdf($id)
    // {
    //     $data = Skrd::with(['user:id,namaLengkap,lokasi,role', 'pembayaran', 'pemilik'])->findOrFail($id);

    //     $user = User::firstWhere('role', 'ROLE_KABID');

    //     // dd($data);

    //     $pdf = Pdf::loadView('exports.skrd.skrd-single-pdf', [
    //         'data' => $data,
    //         'kabid' => $user
    //     ])
    //         ->setPaper('a4', 'portrait')
    //         ->setOptions([
    //             'dpi' => 150,
    //             'defaultFont' => 'arial',
    //             'isHtml5ParserEnabled' => true,
    //             'isPhpEnabled' => true,
    //             'isRemoteEnabled' => true,
    //             'chroot' => realpath("")
    //         ]);

    //     return $pdf->stream("skrd-{$data->noWajibRetribusi}.pdf");
    // }

    // public function downloadSingleExcel($id)
    // {
    //     return Excel::download(new SkrdExport($id), 'skrd-' . $id . '.xlsx');
    // }
}
