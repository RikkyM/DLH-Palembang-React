<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\SubKategori;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkrdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');

        $kategoriId = $request->get('kategori');
        $subKategoriId = $request->get('sub-kategori');
        $petugasId = $request->get('petugas');

        $skrd = Skrd::with(['user:id,namaLengkap', 'pembayaran'])->withsum('pembayaran', 'jumlahBayar');

        if ($search && trim($search) !== '') {
            $skrd->whereHas('user', function ($query) use ($search) {
                $query->where('namaLengkap', 'like', "%{$search}%");
            })->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
        }

        if ($kategoriId) {
            $skrd->where('namaKategori', $kategoriId);
        }

        if ($subKategoriId) {
            $skrd->where('namaSubKategori', $subKategoriId);
        }

        if ($petugasId) {
            $skrd->whereHas('user', function ($query) use ($petugasId) {
                $query->where('id', $petugasId);
            });
        }

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $kategoriId ? SubKategori::where('kodeKategori', $kategoriId)->select('kodeSubKategori', 'namaSubKategori')->get() : collect();
        $petugas = User::select('id', 'namaLengkap')->where('role', 'ROLE_PENDAFTAR')->get();

        return Inertia::render('Super-Admin/Data-Input/Skrd/Index', [
            'skrds' => $skrd->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'kategori' => $kategoriId,
                'subKategori' => $subKategoriId,
                'petugas' => $petugasId
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'petugasOptions' => $petugas
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
