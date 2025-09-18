<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\DetailSetoran;
use App\Models\Setoran;
use App\Models\Skrd;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SetoranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $skrdOptions = Skrd::with('detailSetoran')->select('id', 'noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'alamatObjekRetribusi', 'kecamatanObjekRetribusi', 'kelurahanObjekRetribusi', 'tagihanPerBulanSkrd', 'tagihanPerTahunSkrd', 'jumlahBulan', 'keteranganBulan')
            ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', 1) AS UNSIGNED) ASC")
            ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', -1) AS UNSIGNED) ASC")
            ->whereNotNull('noSkrd')
            ->get()
            ->map(function ($skrd) {
                return [
                    'value' => $skrd->id,
                    'label' => $skrd->noSkrd,
                    'noWajibRetribusi' => $skrd->noWajibRetribusi,
                    'namaObjekRetribusi' => $skrd->namaObjekRetribusi,
                    'alamatObjekRetribusi' => $skrd->alamatObjekRetribusi,
                    'kecamatanObjekRetribusi' => $skrd->kecamatanObjekRetribusi,
                    'kelurahanObjekRetribusi' => $skrd->kelurahanObjekRetribusi,
                    'tagihanPerBulanSkrd' => $skrd->tagihanPerBulanSkrd,
                    'tagihanPerTahunSkrd' => $skrd->tagihanPerTahunSkrd,
                    'jumlahBulan' => $skrd->jumlahBulan,
                    'keteranganBulan' => $skrd->keteranganBulan,
                    'detailSetoran' => $skrd->detailSetoran->map(function ($detailSetoran) {
                        return [
                            'skrdId' => $detailSetoran->skrdId,
                            'nomorNota' => $detailSetoran->nomorNota,
                            'namaBulan' => $detailSetoran->namaBulan,
                            'tanggalBayar' => $detailSetoran->tanggalBayar,
                            'jumlahBayar' => $detailSetoran->jumlahBayar,
                            'keterangan' => $detailSetoran->keterangan
                        ];
                    })
                ];
            });

        return Inertia::render('Super-Admin/Pembayaran/Data-Setoran/Setoran', [
            'skrdOptions' => $skrdOptions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());

        $fileBuktiBayar = $request->file('buktiBayar');
        $namaFileBuktiBayar = Str::uuid() . '.' . $fileBuktiBayar->getClientOriginalExtension();


        $dataSave = [
            'skrdId' => $request->noSkrd,
            'noRef' => $request->noReferensiBank,
            'tanggalBayar' => $request->tanggalBayar,
            'jumlahBayar' => $request->jumlahBayar,
            'namaPenyetor' => $request->namaPengirim,
            'keteranganBulan' => $request->keteranganBulan,
            'buktiBayar' => $namaFileBuktiBayar,
        ];

        $setoran = Setoran::create($dataSave);

        if ($request->detailSetoran) {
            foreach ($request->detailSetoran as $detailSetoran) {
                DetailSetoran::create([
                    'skrdId' => $request->noSkrd,
                    'nomorNota' => $setoran->nomorNota,
                    'namaBulan' => $detailSetoran['bulan'],
                    'tanggalBayar' => $detailSetoran['tanggalBayar'],
                    'jumlahBayar' => $detailSetoran['jumlah'],
                    'keterangan' => $detailSetoran['keterangan'],
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
