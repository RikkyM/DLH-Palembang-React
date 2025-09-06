<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Imports\SubKategoriImport;
use App\Models\Kategori;
use App\Models\SubKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SubKategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $subkategori = SubKategori::with('kategori')
            ->when($search && trim($search) !== '', function ($q) use ($search) {
                $q->whereHas('kategori', function ($kat) use ($search) {
                    $kat->where('namaKategori', 'like', "%{$search}%");
                })->orWhere('namaSubKategori', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->orderBy('namaKategori')->get()->map(function ($kat) {
            return [
                'value' => $kat->kodeKategori,
                'label' => $kat->namaKategori
            ];
        });

        return Inertia::render('Super-Admin/Master-Data/Sub-Kategori/Index', [
            'datas' => $subkategori,
            'kategori' => $kategori,
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
        // dd($request->all());
        $validated = $request->validate([
            'kodeKategori' => 'required',
            'namaSubKategori' => 'required|string',
            'tarif' => 'required|numeric',
            'tarif2' => 'nullable|numeric',
            'satuan' => 'required|string',
            'rumus' => [
                'sometimes',
                'nullable',
                'string',
                'regex:/^[a-zA-Z_]\w*(\s*[\+\-\*\/]\s*[a-zA-Z_]\w*)*$/'
            ],
            'variabel' => 'sometimes|nullable|array',
        ], [
            'kodeKategori.required' => 'Kategori wajib dipilih.',
            'namaSubKategori.required' => 'Nama sub-kategori tidak boleh kosong.',
            'namaSubKategori.string' => 'Nama sub-kategori harus berupa teks.',
            'tarif.required' => 'Tarif harus diisi.',
            'tarif.numeric' => 'Tarif harus berupa angka.',
            'tarif2.numeric' => 'Tarif 2 harus berupa angka.',
            'satuan.required' => 'Satuan harus diisi.',
            'satuan.string' => 'Satuan harus berupa teks.',
            'rumus.regex' => 'Format rumus tidak valid. Gunakan huruf dan operator matematika yang benar.',
            'variabel.array' => 'Variabel harus dalam format array.',
        ]);

        $validated['rumus'] = empty($validated['rumus']) ? null : $validated['rumus'];

        $validated['variabel'] = empty($validated['variabel'])
            ? null
            : $validated['variabel'];

        $validated['tarif2'] = (int) $request->tarif2;

        // $validated['slug'] = Str::slug($validated['namaSubKategori']);

        SubKategori::create($validated);

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
    public function update(Request $request, SubKategori $subKategori)
    {
        $validated = $request->validate([
            'kodeKategori' => 'nullable',
            'namaSubKategori' => 'nullable|string',
            'tarif' => 'nullable|numeric',
            'tarif2' => 'nullable|numeric',
            'satuan' => 'nullable|string',
            'rumus' => [
                'nullable',
                'string',
                'regex:/^[a-zA-Z_]\w*(\s*[\+\-\*\/]\s*[a-zA-Z_]\w*)*$/'
            ],
            'variabel' => 'nullable|array',
        ], [
            'namaSubKategori.required' => 'Nama sub-kategori tidak boleh kosong.',
            'namaSubKategori.string' => 'Nama sub-kategori harus berupa teks.',
            'tarif.required' => 'Tarif harus diisi.',
            'tarif.numeric' => 'Tarif harus berupa angka.',
            'tarif2.numeric' => 'Tarif 2 harus berupa angka.',
            'satuan.required' => 'Satuan harus diisi.',
            'satuan.string' => 'Satuan harus berupa teks.',
            'rumus.regex' => 'Format rumus tidak valid. Gunakan huruf dan operator matematika yang benar.',
            'variabel.array' => 'Variabel harus dalam format array.',
        ]);

        $validated['rumus'] = empty($validated['rumus']) ? null : $validated['rumus'];

        $validated['variabel'] = empty($validated['variabel'])
            ? null
            : $validated['variabel'];

        // if (isset($validated['namaSubKategori'])) {
        //     $validated['slug'] = Str::slug($validated['namaSubKategori']);
        // }

        $validated['tarif2'] = (int) $request->tarif2;

        $validated = array_filter($validated, function ($value) {
            return $value !== null && $value !== '';
        });

        if (isset($validated['kodeSubKategori']) && $validated['kodeSubKategori'] !== $subKategori->kodeSubKategori) {
            SubKategori::where('kodeSubKategori', $subKategori->kodeSubKategori)->update($validated);
        } else {
            $subKategori->update($validated);
        }

        return redirect()->back()->withInput([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubKategori $subKategori)
    {
        $subKategori->delete();

        return redirect()->back();
    }

    public function importExcelIndex()
    {
        return view('imports.import');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        Excel::import(new SubKategoriImport, $request->file('file'));

        return back();
    }
}
