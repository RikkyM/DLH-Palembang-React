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

        $query = Pemilik::with(['kecamatan', 'kelurahan']);
        // ->whereHas('uptd', function ($q) {
        //     $q->where('id', Auth::user()->uptdId);
        // });

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
            // ->whereHas('uptd', function ($q) {
            //     $q->where('id', auth()->user()->uptdId);
            // })
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

        $pemohon = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        return Inertia::render('Pendaftar/Data-Input/Pemohon/Index', [
            'datas' => $pemohon,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'per_page' => (int) $getPage
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

    public function getKtp($filename)
    {
        $path = storage_path('app/private/foto/ktp/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        };

        return response()->file($path);
    }
}
