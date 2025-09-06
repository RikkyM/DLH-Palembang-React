<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $kategori = Kategori::query()
            ->when($search && trim($search), function ($q) use ($search) {
                $q->where('namaKategori', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Super-Admin/Master-Data/Kategori/Index', [
            'datas' => $kategori,
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
            'namaKategori' => 'required|min:5|unique:kategori,namaKategori'
        ], [
            'namaKategori.required' => 'Nama kategori wajib diisi.',
            'namaKategori.min' => 'Nama kategori minimal 5 karakter.',
            'namaKategori.unique' => 'Nama kategori sudah digunakan.',
        ]);

        Kategori::create([
            'namaKategori' => $validated['namaKategori'],
            'slug' => Str::slug($validated['namaKategori'])
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
    public function update(Request $request, Kategori $kategori)
    {
        $validated = $request->validate([
            'namaKategori' => 'nullable|min:5|unique:kategori,namaKategori,' . $kategori->kodeKategori . ',kodeKategori',
        ], [
            'namaKategori.min' => 'Nama kategori minimal 5 karakter.',
            'namaKategori.unique' => 'Nama kategori sudah digunakan.',
        ]);

        $kategori->update([
            'namaKategori' => $validated['namaKategori'] ?? $kategori->namaKategori,
            'slug' => isset($validated['namaKategori']) ? Str::slug($validated['namaKategori']) : $kategori->slug
        ]);

        return redirect()->back()->withInput([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kategori $kategori)
    {
        $kategori->delete();

        return redirect()->back();
    }
}
