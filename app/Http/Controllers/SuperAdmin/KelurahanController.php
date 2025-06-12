<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KelurahanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $kelurahan = Kelurahan::with(['kecamatan'])
            ->when($search && trim($search) !== '', function ($q) use ($search) {
                $q->whereHas('kecamatan', function ($kec) use ($search) {
                    $kec->where('namaKecamatan', 'like', "%{$search}%");
                })->orWhere('namaKelurahan', 'like', "%{$search}%");
            })
            ->orderBy('kodeKecamatan', 'ASC')
            ->paginate(10)
            ->withQueryString();

        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->orderBy('namaKecamatan')->get()->map(function ($kecamatan) {
            return [
                'value' => $kecamatan->kodeKecamatan,
                'label' => $kecamatan->namaKecamatan
            ];
        });

        return Inertia::render('Super-Admin/Settings/Kelurahan/Index', [
            'datas' => $kelurahan,
            'kecamatan' => $kecamatan,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null
            ]
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
            'namaKelurahan' => 'required|min:5|unique:kelurahan,namaKelurahan',
            'kodeKecamatan' => 'required'
        ], [
            'namaKelurahan.required' => 'Nama kelurahan wajib diisi.',
            'namaKelurahan.min' => 'Nama kelurahan minimal 5 karakter',
            'namaKelurahan.unique' => 'Nama kelurahan telah digunakan',
        ]);

        Kelurahan::create([
            'namaKelurahan' => $validated['namaKelurahan'],
            'kodeKecamatan' => $validated['kodeKecamatan'],
            'slug' => Str::slug($validated['namaKelurahan'])
        ]);

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
    public function update(Request $request, Kelurahan $kelurahan)
    {
        $validated = $request->validate([
            'namaKelurahan' => 'sometimes|nullable|min:5|unique:kelurahan,namaKelurahan,' . $kelurahan->kodeKelurahan . ',kodeKelurahan',
            'kodeKecamatan' => 'sometimes|nullable'
        ], [
            'namaKelurahan.min' => 'Nama kelurahan minimal 5 karakter',
            'namaKelurahan.unique' => 'Nama kelurahan telah digunakan',
        ]);

        $data = [
            'namaKelurahan' => $validated['namaKelurahan'] ?? $kelurahan->namaKelurahan,
            'kodeKecamatan' => $validated['kodeKecamatan'] ?? $kelurahan->kodeKecamatan,
            'slug' => isset($validated['namaKelurahan']) ? Str::slug($validated['namaKelurahan']) : $kelurahan->slug
        ];

        $kelurahan->update($data);

        return redirect()->back()->withInput([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelurahan $kelurahan)
    {
        $kelurahan->delete();

        return redirect()->back();
    }
}
