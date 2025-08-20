<?php

namespace App\Http\Controllers\Kuptd;

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

        return collect(range(1, 12))
            ->map(function ($i) {
                return strtoupper(Carbon::create()->month($i)->translatedFormat('M'));
            });
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd('asd');
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getStatus = $request->get('status');

        $skrd = Skrd::with([
            'user:id,namaLengkap,lokasi',
            'pembayaran' => fn($q) => $q->orderBy('tanggalBayar')
        ])->where('uptdId', auth()->user()->uptdId)->addSelect([
            'skrd.*',
            'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                ->whereColumn('skrdId', 'skrd.id')
        ]);

        if ($getSortBy === 'sisa_tertagih') {
            $skrd->orderByRaw("(tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) {$getSortDir}");
        } elseif ($getSortBy === 'statusLunas') {
            $skrd->orderByRaw("CASE WHEN (tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) = 0 THEN 0 ELSE 1 END {$getSortDir}");
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
            $skrd->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) = 0');
        } elseif ($getStatus === 'belum_lunas') {
            $skrd->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) > 0');
        }

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $getKategori ?
            SubKategori::whereHas('kategori', function ($query) use ($getKategori) {
                $query->where('namaKategori', $getKategori);
            })->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();

        return Inertia::render('Kuptd/Data-Input/Skrd/Index', [
            'datas' => $skrd->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'kategori' => $getKategori,
                'subKategori' => $getSubKategori,
                'status' => $getStatus
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'bulan' => $this->getBulan()
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
        return Inertia::render('Kuptd/Data-Input/Skrd/Show', [
            'data' => $skrd->load(['user', 'pembayaran', 'pemilik', 'uptd']),
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
