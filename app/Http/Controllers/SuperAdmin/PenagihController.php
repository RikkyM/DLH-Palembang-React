<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Exports\PenagihExport;
use App\Http\Controllers\Controller;
use App\Models\Penagih;
use App\Models\Uptd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PenagihController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $getPage = $request->get('per_page', 10);

        $penagih = Penagih::when($getSearch && trim($getSearch) !== '', function ($query) use ($getSearch) {
            $query->where('nama', 'like', "%{$getSearch}%");
        })
            ->orderByDesc('id');

        $datas = $getPage <= 0 ? $penagih->get() : $penagih->paginate($getPage)
            ->withQueryString();

        $wilayahUptdOptions = Uptd::select('id', 'namaUptd')
            ->orderBy('id')
            ->get()
            ->map(function ($uptd) {
                return [
                    'value' => ucfirst(strtolower($uptd->namaUptd)),
                    'label' => ucfirst(strtolower($uptd->namaUptd)),
                ];
            });

        return Inertia::render('Super-Admin/Master-Data/Penagih/Index', [
            'datas' => $datas,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'per_page' => (int) $getPage
            ],
            'uptdOptions' => $wilayahUptdOptions
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
        $validated = $request->validate([
            'nama' => 'required|min:3',
            'jabatan' => 'required',
            'statusPegawai' => 'required',
            'wilayah_uptd' => 'required'
        ]);

        Penagih::create($validated);

        return redirect()->back()->withInput([]);
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
    public function update(Request $request, Penagih $penagih)
    {
        $validated = $request->validate([
            'nama' => 'nullable|min:3',
            'jabatan' => 'nullable',
            'statusPegawai' => 'nullable',
            'wilayah_uptd' => 'nullable'
        ]);

        $penagih->update([
            'nama' => $validated['nama'] ?? $penagih->nama,
            'jabatan' => $validated['jabatan'] ?? $penagih->jabatan,
            'statusPegawai' => $validated['statusPegawai'] ?? $penagih->statusPegawai,
            'wilayah_uptd' => $validated['wilayah_uptd'] ?? $penagih->wilayah_uptd,
        ]);

        return redirect()->back()->withInput([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function exportPenagih(Request $request)
    {
        $filename = 'penagih-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new PenagihExport($request),
            $filename
        );
    }
}
