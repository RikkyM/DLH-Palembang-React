<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Skrd;
use App\Models\SubKategori;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SkrdController extends Controller
{
    private function getBulan()
    {
        Carbon::setLocale('id');

        return collect(range(1, 12))->map(
            fn($i) =>
            strtoupper(Carbon::create()->month($i)->translatedFormat('F'))
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getStatus = $request->get('status');
        $getBulan = $request->get('bulan');
        $getTahun = $request->get('tahun');
        $getPage = $request->get('per_page', 10);

        $skrd = Skrd::with([
            'user:id,namaLengkap,lokasi',
            'pembayaran',
            'setoran' => fn($q) => $q->where('status', 'Approved'),
            'detailSetoran.setoran' => fn($q) => $q->orderBy('tanggalBayar')
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

        $paidEfektif = "CASE WHEN COALESCE(pembayaran_sum_jumlah_bayar,0) > 0
                    THEN COALESCE(pembayaran_sum_jumlah_bayar,0)
                    ELSE COALESCE(setoran_sum_jumlah,0)
                    END";

        if ($getSortBy === 'sisa_tertagih') {
            $skrd->orderByRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) {$getSortDir}");
        } elseif ($getSortBy === 'statusLunas') {
            $skrd->orderByRaw("CASE WHEN (tagihanPerTahunSkrd - ({$paidEfektif})) = 0 THEN 0 ELSE 1 END {$getSortDir}");
        } else {
            $skrd->orderBy($getSortBy, $getSortDir);
        }

        if ($getSearch && trim($getSearch) !== '') {
            $skrd->where('namaObjekRetribusi', 'like', "%{$getSearch}%");
        }

        if ($getKategori) {
            $skrd->where('namaKategori', $getKategori);
        }

        if ($getSubKategori) {
            $skrd->where('namaSubKategori', $getSubKategori);
        }

        if ($getStatus === 'lunas') {
            $skrd->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) = 0");
        } elseif ($getStatus === 'belum_lunas') {
            $skrd->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) > 0");
        }

        if ($getBulan) {
            $skrd->whereMonth('created_at', (int) $getBulan);
        }

        if ($getTahun) {
            $skrd->whereYear('created_at', (int) $getTahun);
        }

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $getKategori ?
            SubKategori::whereRelation('kategori', 'namaKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();

        $tahunOptions = Skrd::selectRaw('YEAR(created_at) as tahun')
            ->distinct()->orderByDesc('tahun')->pluck('tahun');

        $datas = $getPage <= 0 ? $skrd->get() : $skrd->paginate($getPage)->withQueryString();

        return Inertia::render('Bendahara/Inbox-Data/Skrd/Index', [
            'datas' => $datas,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'kategori' => $getKategori,
                'subKategori' => $getSubKategori,
                'status' => $getStatus,
                'bulan' => $getBulan,
                'tahun' => $getTahun,
                'per_page' => $getPage
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
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
        return Inertia::render('Bendahara/Inbox-Data/Skrd/Show', [
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
}
