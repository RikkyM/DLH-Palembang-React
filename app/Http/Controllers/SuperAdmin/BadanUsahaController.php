<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BadanUsaha;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BadanUsahaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');

        $badanUsaha = BadanUsaha::when($getSearch && trim($getSearch) !== '', function ($query) use ($getSearch) {
            $query->where('namaBadanUsaha', 'like', "%{$getSearch}%");
        })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Super-Admin/Master-Data/Badan-Usaha/Index', [
            'datas' => $badanUsaha,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null
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
            'namaBadanUsaha' => "required|min:3|unique:badan_usaha,namaBadanUsaha"
        ], [
            'namaBadanUsaha.required' => 'Nama wajib diisi.',
            'namaBadanUsaha.min' => 'Nama minimal 3 huruf.',
            'namaBadanUsaha.unique' => 'Nama telah digunakan.',
        ]);

        BadanUsaha::create([
            'namaBadanUsaha' => $validated['namaBadanUsaha']
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
    public function update(Request $request, BadanUsaha $badan_usaha)
    {
        $validated = $request->validate([
            'namaBadanUsaha' => 'nullable|min:3|unique:badan_usaha,namaBadanUsaha,' . $badan_usaha->id
        ], [
            'namaBadanUsaha.min' => 'Nama minimal 3 huruf.',
            'namaBadanUsaha.unique' => 'Nama telah digunakan.',
        ]);

        $badan_usaha->update([
            'namaBadanUsaha' => $validated['namaBadanUsaha'] ?? $badan_usaha->namaBadanUsaha
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
}
