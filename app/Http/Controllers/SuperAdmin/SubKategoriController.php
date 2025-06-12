<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\SubKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
            ->orderBy('kodeSubKategori', 'ASC')
            ->paginate(10)
            ->withQueryString();

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->orderBy('namaKategori')->get()->map(function ($kat) {
            return [
                'value' => $kat->kodeKategori,
                'label' => $kat->namaKategori
            ];
        });

        return Inertia::render('Super-Admin/Settings/Sub-Kategori/Index', [
            'datas' => $subkategori,
            'kategori' => $kategori,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null
            ]
        ]);
    }

    private function parseFormula($formula)
    {
        $clean = trim($formula);

        preg_match_all('/[a-zA-Z_][a-zA-Z0-9_]*/', $clean, $matches);

        $variables = array_unique($matches[0]);

        sort($variables);

        return [
            'rumus' => $clean,
            'variabel' => array_values($variables)
        ];
    }

    private function validateFormula($formula)
    {
        // Cek apakah rumus hanya mengandung karakter yang diizinkan
        if (!preg_match('/^[a-zA-Z0-9_\s\+\-\*\/\(\)\.]+$/', $formula)) {
            return false;
        }

        // Cek apakah ada minimal satu variabel
        if (!preg_match('/[a-zA-Z_][a-zA-Z0-9_]*/', $formula)) {
            return false;
        }

        return true;
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
            'kodeKategori' => 'required',
            'namaSubKategori' => 'required|string',
            'tarif' => 'required|numeric',
            'satuan' => 'required|string',
            'perhitungan' => 'sometimes|nullable|array',
            'perhitungan.rumus' => [
                'sometimes',
                'nullable',
                'string',
                'regex:/^[a-zA-Z_]\w*(\s*[\+\-\*\/]\s*[a-zA-Z_]\w*)*$/'
            ],
            'perhitungan.variabel' => 'sometimes|nullable|array',
        ], [
            'kodeKategori.required' => 'Kategori wajib dipilih.',
            'namaSubKategori.required' => 'Nama sub-kategori tidak boleh kosong.',
            'namaSubKategori.string' => 'Nama sub-kategori harus berupa teks.',
            'tarif.required' => 'Tarif harus diisi.',
            'tarif.numeric' => 'Tarif harus berupa angka.',
            'satuan.required' => 'Satuan harus diisi.',
            'satuan.string' => 'Satuan harus berupa teks.',
            'perhitungan.rumus.regex' => 'Format rumus tidak valid. Gunakan huruf dan operator matematika yang benar.',
            'perhitungan.variabel.array' => 'Variabel harus dalam format array.',
        ]);

        $validated['perhitungan'] = empty($validated['perhitungan']['rumus'])
            ? null
            : json_encode($validated['perhitungan']);
        $validated['slug'] = Str::slug($validated['namaSubKategori']);

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
            'kodeSubKategori' => 'nullable|unique:sub_kategori,kodeSubKategori,' . $subKategori->kodeSubKategori . ',kodeSubKategori',
            'kodeKategori' => 'nullable',
            'namaSubKategori' => 'nullable|string',
            'tarif' => 'nullable|numeric',
            'satuan' => 'nullable|string',
            'perhitungan' => 'nullable|array',
            'perhitungan.rumus' => [
                'nullable',
                'string',
                'regex:/^[a-zA-Z_]\w*(\s*[\+\-\*\/]\s*[a-zA-Z_]\w*)*$/'
            ],
            'perhitungan.variabel' => 'nullable|array',
        ], [
            'kodeSubKategori.unique' => 'Kode sub-kategori sudah digunakan.',
            'kodeKategori.required' => 'Kategori wajib dipilih.',
            'namaSubKategori.required' => 'Nama sub-kategori tidak boleh kosong.',
            'namaSubKategori.string' => 'Nama sub-kategori harus berupa teks.',
            'tarif.required' => 'Tarif harus diisi.',
            'tarif.numeric' => 'Tarif harus berupa angka.',
            'satuan.required' => 'Satuan harus diisi.',
            'satuan.string' => 'Satuan harus berupa teks.',
            'perhitungan.rumus.regex' => 'Format rumus tidak valid. Gunakan huruf dan operator matematika yang benar.',
            'perhitungan.variabel.array' => 'Variabel harus dalam format array.',
        ]);

        $validated['perhitungan'] = json_encode($validated['perhitungan'] ?? []);
        $validated['slug'] = Str::slug($validated['namaSubKategori']);

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
}
