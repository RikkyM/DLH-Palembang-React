<?php

namespace App\Http\Controllers\Kasubag;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Skrd;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'asc');

        $query = Invoice::query()
            ->select('invoices.*')
            ->join('skrd', 'invoices.noSkrd', '=', 'skrd.noSkrd')
            ->with(['skrd:noSkrd,noWajibRetribusi,namaObjekRetribusi,alamatObjekRetribusi,kelurahanObjekRetribusi,kecamatanObjekRetribusi,tagihanPerBulanSkrd'])
            ->whereRelation('skrd', 'uptdId', auth()->user()->uptdId);

        if ($getSearch && trim($getSearch) !== '') {
            $query->whereHas('skrd', function ($q) use ($getSearch) {
                $q->where('noSkrd', 'like', "%{$getSearch}%")
                ->orWhere('namaObjekRetribusi', 'like', "%{$getSearch}%")
                ->orWhere('alamatObjekRetribusi', 'like', "%{$getSearch}%");
            })
                ->orWhere('no_invoice', 'like', "%{$getSearch}%");
        }

        switch ($getSortBy) {
            case 'noWajibRetribusi':
                $query->orderBy('skrd.noWajibRetribusi', $getSortDir);
                break;
            case 'namaObjekRetribusi':
                $query->orderBy('skrd.namaObjekRetribusi', $getSortDir);
                break;
            case 'jumlah_bulan':
            case 'satuan':
            case 'total_retribusi':
            case 'no_invoice':
            case 'id':
            default:
                $query->orderBy($getSortBy, $getSortDir);
                break;
        }

        $invoices = $query->paginate(10);
        $skrd = Skrd::select('noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'tagihanPerBulanSkrd')
        ->where('noSkrd', '!=', null)
            ->where('uptdId', auth()->user()->uptdId)
            ->get()
            ->sortBy(function ($item) {
                $parts = explode('/', $item->noSkrd);

                $nomorAwal = (int) $parts[0];
                $tahun = (int) end($parts);

                return ([$nomorAwal, $tahun]);
            })
            ->values()
            ->map(function ($skrd) {
                return [
                    'value' => $skrd->noSkrd,
                    'label' => $skrd->noSkrd,
                    'namaObjekRetribusi' => $skrd->namaObjekRetribusi,
                    'tagihanPerbulan' => $skrd->tagihanPerBulanSkrd
                ];
            });

        // dd($skrd);

        return Inertia::render('Kasubag/Tagihan/Index', [
            'datas' => $invoices,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir
            ],
            'retribusiOptions' => $skrd,
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
        $skrd = Skrd::where('noSkrd', $request->noSkrd)->firstOrFail();
        $tarifRetribusi = $skrd->tagihanPerBulanSkrd;

        $total = $request->jumlahBulan > 0 ? $request->jumlahBulan * $tarifRetribusi : $tarifRetribusi;

        DB::beginTransaction();
        try {
            Invoice::create([
                'noSkrd' => $request->noSkrd,
                'jumlah_bulan' => $request->jumlahBulan,
                'satuan' => $request->satuan,
                'total_retribusi' => $total,
                'terbilang' => trim(terbilang($total)),
                'tanggal_terbit' => $request->tanggalTerbit,
                'jatuh_tempo' => $request->jatuhTempo
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['server' => "Terjadi kesalahan saat menyimpan tagihan."]);
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
