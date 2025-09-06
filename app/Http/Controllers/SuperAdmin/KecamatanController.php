<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KecamatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $kecamatan = Kecamatan::query()
            ->when($search && trim($search) !== '', function ($q) use ($search) {
                $q->where('namaKecamatan', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('Super-Admin/Master-Data/Kecamatan/Index', [
            'datas' => $kecamatan,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
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
            'namaKecamatan' => 'required|min:5|unique:kecamatan,namaKecamatan'
        ], [
            'namaKecamatan.required' => 'Nama kecamatan wajib diisi.',
            'namaKecamatan.min' => 'Nama kecamatan minimal 5 karakter',
            'namaKecamatan.unique' => 'Nama kecamatan sudah digunakan'
        ]);

        Kecamatan::create([
            'namaKecamatan' => $validated['namaKecamatan'],
            'slug' => Str::slug($validated['namaKecamatan'])
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
    public function update(Request $request, $kodeKecamatan)
    {
        $kecamatan = Kecamatan::where('kodeKecamatan', $kodeKecamatan)->firstOrFail();


        $validated = $request->validate([
            'namaKecamatan' => 'sometimes|nullable|min:5|unique:kecamatan,namaKecamatan,' . $kecamatan->kodeKecamatan . ',kodeKecamatan'
        ], [
            'namaKecamatan.min' => 'Nama kecamatan minimal 5 karakter',
            'namaKecamatan.unique' => 'Nama kecamatan sudah digunakan'
        ]);

        $kecamatan->update([
            'namaKecamatan' => $validated['namaKecamatan'] ?? $kecamatan->namaKecamatan,
            'slug' => isset($validated['namaKecamatan']) ? Str::slug($validated['namaKecamatan']) : $kecamatan->slug
        ]);

        return redirect()->back()->withInput([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kecamatan $kecamatan)
    {
        $kecamatan->delete();

        return redirect()->back();
    }
}
