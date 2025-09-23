<?php

namespace App\Http\Controllers\Pendaftar;

use App\Http\Controllers\Controller;
use App\Http\Requests\PemohonRequest;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $sortDir = $request->get('direction', 'desc');
        $getPage = $request->get('per_page', 10);
        $getKecamatan = $request->get('kecamatan');
        $getKelurahan = $request->get('kelurahan');

        $query = Pemilik::with(['kecamatan', 'kelurahan']);

        if ($search && trim($search) !== '') {
            $query->where('namaPemilik', 'like', "%{$search}%")
                ->orWhere('nik', 'like', "%{$search}%")
                ->orWhere('alamat', 'like', "%{$search}%");
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

        if ($getKecamatan) {
            $query->whereHas(
                'kecamatan',
                function ($q) use ($getKecamatan) {
                    $q->where('kodeKecamatan', $getKecamatan);
                }
            );
        }

        if ($getKelurahan) {
            $query->whereHas('kelurahan', function ($q) use ($getKelurahan) {
                $q->where('kodeKelurahan', $getKelurahan);
            });
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

        $kelurahanFilter = collect();

        if ($getKecamatan) {
            $kelurahanFilter = Kelurahan::select('kodeKelurahan', 'namaKelurahan')
                ->where('kodeKecamatan', $getKecamatan)
                ->orderBy('namaKelurahan')
                ->get()
                ->map(fn($kel) => [
                    'value' => $kel->kodeKelurahan,
                    'label' => $kel->namaKelurahan
                ]);
        }

        $pemohon = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        return Inertia::render('Pendaftar/Data-Input/Pemohon/Index', [
            'datas' => $pemohon,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'per_page' => (int) $getPage,
                'kecamatan' => $getKecamatan,
                'kelurahan' => $getKelurahan
            ],
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kelurahanFilter' => $kelurahanFilter,
            'role' => Auth::user()->role
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
            $request->handle();

            return back();
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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
