<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Skrd;
use Illuminate\Http\Request;
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
        $skrdOptions = Skrd::select('noSkrd', 'namaObjekRetribusi', 'alamatObjekRetribusi', 'kecamatanObjekRetribusi', 'kelurahanObjekRetribusi', 'tagihanPerBulanSkrd', 'tagihanPerTahunSkrd', 'jumlahBulan', 'keteranganBulan')
        ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', 1) AS UNSIGNED) ASC")
        ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', -1) AS UNSIGNED) ASC")
        ->whereNotNull('noSkrd')
            ->get()
            ->map(function ($skrd) {
                return [
                    'value' => $skrd->noSkrd,
                    'label' => $skrd->noSkrd,
                    'namaObjekRetribusi' => $skrd->namaObjekRetribusi,
                    'alamatObjekRetribusi' => $skrd->alamatObjekRetribusi,
                    'kecamatanObjekRetribusi' => $skrd->kecamatanObjekRetribusi,
                    'kelurahanObjekRetribusi' => $skrd->kelurahanObjekRetribusi,
                    'tagihanPerBulanSkrd' => $skrd->tagihanPerBulanSkrd,
                    'tagihanPerTahunSkrd' => $skrd->tagihanPerTahunSkrd,
                    'jumlahBulan' => $skrd->jumlahBulan,
                    'keteranganBulan' => $skrd->keteranganBulan
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
        //
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
