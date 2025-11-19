<?php

namespace App\Http\Controllers\Kuptd;

use App\Http\Controllers\Controller;
use App\Models\Setoran;
use App\Models\Skrd;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SetoranController extends Controller
{
    private function getMetodeBayar()
    {
        $metode = ['Transfer', 'Qris', 'Kliring', 'E-Wallet'];
        return collect($metode)->map(fn($s) => [
            'value' => $s,
            'label' => $s
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $sortBy = $request->get('sort', 'nomorNota');
        $sortDir = $request->get('direction', 'desc');
        $getPage = $request->get('per_page', 10);
        $getSkrd = $request->get('skrd');
        $getMetode = $request->get('metode');
        $getStatus = $request->get('status');
        $getTanggal = $request->get('tanggal_bayar');
        $tanggalSerah = $request->get('tanggal_serah');
        $tanggalAcc = $request->get('tanggal_acc');
        $nominal = $request->get('nominal');
        $getTarif = $request->get('tarif_perbulan');

        $query = Setoran::with(['skrd', 'detailSetoran'])
            ->where('current_stage', '!=', 'kasubag')
            ->whereHas('skrd', fn($q) => $q->where('uptdId', auth()->user()->uptdId));

        if ($getSearch && trim($getSearch) !== '') {
            $query->whereHas('skrd', function ($q) use ($getSearch) {
                $q->where('noSkrd', 'like', "%{$getSearch}%")
                    ->orWhere('namaObjekRetribusi', 'like', "%{$getSearch}%");
            })
                ->orWhere(function ($q) use ($getSearch) {
                    $q->where('nomorNota', 'like', "%{$getSearch}%");
                })
                ->orWhere('namaBank', 'like', "%{$getSearch}%");
        }

        switch ($sortBy) {
            case 'noSkrd':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.noSkrd', $sortDir)
                    ->select('setoran.*');
                break;
            case 'namaObjekRetribusi':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.namaObjekRetribusi', $sortDir)
                    ->select('setoran.*');
                break;
            case 'kecamatan':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.kecamatanObjekRetribusi', $sortDir)
                    ->select('setoran.*');
                break;
            case 'tagihanPerBulanSkrd':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.tagihanPerBulanSkrd', $sortDir)
                    ->select('setoran.*');
                break;
            default:
                $query->orderBy($sortBy, $sortDir);
                break;
        }

        if (!empty($getSkrd)) {
            $query->where('setoran.skrdId', $getSkrd);
        }

        if ($getMetode) {
            $query->where('metodeBayar', $getMetode);
        }

        if ($getTanggal) {
            $query->whereDate('tanggalBayar', $getTanggal);
        }

        if ($tanggalSerah) {
            $query->whereDate('tanggal_serah', $tanggalSerah);
        }

        if ($tanggalAcc) {
            $query->whereDate('tanggal_diterima', $tanggalAcc);
        }

        if ($nominal) {
            // $query->where('jumlahBayar', 'like', "%{$nominal}%");
            $query->where('jumlahBayar', $nominal);
        }

        if ($getTarif) {
            $query->whereRelation('skrd', 'tagihanPerBulanSkrd', $getTarif);
        }

        if ($getStatus) {
            $query->where('status', $getStatus);
        }

        $statuses = [
            'Approved' => 'Diterima',
            'Processed' => 'Diproses',
            'Rejected' => 'Ditolak',
        ];

        $statusOptions = collect($statuses)->map(fn($label, $value) => [
            'value' => $value,
            'label' => $label,
        ])->values()->all();

        $skrdOptions = Skrd::with('setoran')
            ->where('uptdId', auth()->user()->uptdId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($s) => [
                'value' => (string) $s->id,
                'label' => (string) $s->noSkrd
            ]);

        $datas = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        return Inertia::render('Kuptd/Penerimaan/Index', [
            'datas' => Inertia::defer(fn() => $datas),
            'filters' => [
                'search' => ($getSearch && trim($getSearch) === '') ? $getSearch : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'per_page' => (int) $getPage,
                'skrd' => (int) $getSkrd,
                'metode' => $getMetode,
                'tanggal_bayar' => $getTanggal,
                'tanggal_serah' => $tanggalSerah,
                'tanggal_acc'   => $tanggalAcc,
                'nominal' => (int) $nominal,
                'tarif_perbulan' => (int) $getTarif,
                'status' => $getStatus && trim($getStatus) !== '' ? $getStatus : null
            ],
            'statusOptions' => $statusOptions,
            'skrdOptions' => $skrdOptions,
            'metodeOptions' => $this->getMetodeBayar(),
            'role' => auth()->user()->role
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
    public function show(Setoran $data)
    {
        $data->load(['skrd', 'detailSetoran']);
        return Inertia::render('Kuptd/Penerimaan/Detail', [
            'data' => $data
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
    public function update(Request $request)
    {
        $setoran = Setoran::where('nomorNota', $request->nota)->firstOrFail();
        $request->validate([
            'keterangan' => 'required'
        ], [
            'keterangan.required' => 'Keterangan perlu diisi.'
        ]);
        try {
            DB::transaction(function () use ($request, $setoran) {
                // dd($request->all());
                if ($request->status === "Rejected") {
                    $setoran->update([
                        'status' => 'Rejected',
                        'keterangan' => $request->keterangan ?: null
                    ]);
                    return;
                }

                $movingToBendahara = $setoran->current_stage !== 'bendahara';
                $isTemp = str_starts_with($setoran->nomorNota, 'TEMP-');

                if ($movingToBendahara && $isTemp) {
                    $oldNota = $setoran->nomorNota;
                    $newNota = Setoran::generateNomorNota();
                    // dd($oldNota, $newNota);

                    $setoran->nomorNota = $newNota;
                    $setoran->current_stage = 'bendahara';
                    $setoran->tanggal_serah = now();
                    $setoran->keterangan = $request->keterangan ?: null;
                    $setoran->save();
                } else {
                    $setoran->update(['current_stage' => 'bendahara']);
                }
            });
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->withErrors(['server' => 'Terjadi kesalahan ketika memproses setoran']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // public function prosesSetoran(Setoran $data)
    // {
    //     try {
    //         DB::transaction(function () use ($data) {
    //             $data->update([
    //                 'current_stage' => 'bendahara'
    //             ]);
    //         });
    //     } catch (\Exception $e) {
    //         report($e);
    //         return redirect()->back()->withErrors(['server' => 'Terjadi kesalahan ketika memproses setoran.']);
    //     }
    // }
}
