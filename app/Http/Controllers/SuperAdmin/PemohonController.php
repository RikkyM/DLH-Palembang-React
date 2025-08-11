<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PemohonRequest;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemohonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');

        $query = Pemilik::with(['kecamatan', 'kelurahan']);

        if ($search && trim($search) !== '') {
            $query->where('namaPemilik', 'like', "%{$search}%");
        }

        switch ($sortBy) {
            case 'kodeKecamatan':
                $query->leftJoin('kecamatan', 'pemilik.kodeKecamatan', '=', 'kecamatan.kodeKecamatan')
                    ->orderBy('kecamatan.namaKecamatan', $sortDir)
                    ->select('pemilik.*');
                break;

            case 'kodeKelurahan':
                $query->leftJoin('kelurahan', 'pemilik.kodeKelurahan', '=', 'kelurahan.kodeKelurahan')
                    ->orderBy('kelurahan.namaKelurahan', $sortDir)
                    ->select('pemilik.*');
                break;

            default:
                if (in_array($sortBy, ['id', 'nik', 'namaPemilik', 'alamat', 'tempatLahir', 'tanggalLahir', 'noHP', 'email', 'jabatan'])) {
                    $query->orderBy($sortBy, $sortDir);
                } else {
                    $query->orderBy('id', $sortDir);
                }
                break;
        }

        $kecamatanOptions = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
            ->orderBy('namaKecamatan')
            ->get()
            ->map(function ($kecamatan) {
                return [
                    'value' => $kecamatan->kodeKecamatan,
                    'label' => $kecamatan->namaKecamatan
                ];
            });

        $kelurahanOptions = Kelurahan::select('kodeKelurahan', 'namaKelurahan', 'kodeKecamatan')
            ->orderBy('namaKelurahan')
            ->get()
            ->groupBy('kodeKecamatan')
            ->map(function ($groupedKelurahan) {
                return $groupedKelurahan->map(function ($kelurahan) {
                    return [
                        'value' => $kelurahan->kodeKelurahan,
                        'label' => $kelurahan->namaKelurahan
                    ];
                })->values();
            });

        $pemohon = $query->paginate(10)->withQueryString();

        return Inertia::render('Super-Admin/Data-Input/Pemohon/Index', [
            'datas' => $pemohon,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir
            ],
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions
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
    public function store(PemohonRequest $request)
    {
        try {
            // Pemilik::create($request->validated());
            $request->handle();

            return back();
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan saat menyimpan data');
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
    public function update(PemohonRequest $request, int $data)
    {
        try {
            $request->handle($data);

            return redirect()->back()->with('success', 'Data pemohon berhasil diperbarui.');
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
