<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Skrd;
use Illuminate\Http\Request;
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
        $getPage = (int) $request->get('per_page', 10);

        $query = Invoice::query()
            ->select('invoices.*')
            ->join('skrd', 'invoices.noSkrd', '=', 'skrd.noSkrd')
            ->with(['skrd:noSkrd,noWajibRetribusi,namaObjekRetribusi,alamatObjekRetribusi,kelurahanObjekRetribusi,kecamatanObjekRetribusi,tagihanPerBulanSkrd']);

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

        $invoices = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        $skrd = Skrd::select('noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'tagihanPerBulanSkrd')
            ->where('noSkrd', '!=', null)
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

        return Inertia::render('Bendahara/Tagihan/Index', [
            'datas' => $invoices,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'per_page' => $getPage
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
