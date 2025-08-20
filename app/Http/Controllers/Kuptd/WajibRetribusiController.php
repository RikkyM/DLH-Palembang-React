<?php

namespace App\Http\Controllers\Kuptd;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use App\Models\SubKategori;
use App\Models\WajibRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WajibRetribusiController extends Controller
{
    private function sortTable($query, $sortBy, $sortDir)
    {
        switch ($sortBy) {
            case 'kecamatan':
                $query->join('kecamatan', 'wajib_retribusi.kodeKecamatan', '=', 'kecamatan.kodeKecamatan')
                    ->orderBy('kecamatan.namaKecamatan', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'kelurahan':
                $query->join('kelurahan', 'wajib_retribusi.kodeKelurahan', '=', 'kelurahan.kodeKelurahan')
                    ->orderBy('kelurahan.namaKelurahan', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'rincian':
                $query->join('kategori', 'wajib_retribusi.kodeKategori', '=', 'kategori.kodeKategori')
                    ->orderBy('kategori.namaKategori', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'detailRincian':
                $query->join('sub_kategori', 'wajib_retribusi.kodeSubKategori', '=', 'sub_kategori.kodeSubKategori')
                    ->orderBy('sub_kategori.namaSubKategori', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'penanggungJawab':
                $query->join('pemilik', 'wajib_retribusi.pemilikId', '=', 'pemilik.id')
                    ->orderBy('pemilik.namaPemilik', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'uptd':
                $query->join('uptd', 'wajib_retribusi.uptdId', '=', 'uptd.id')
                    ->orderBy('uptd.namaUptd', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            case 'petugas':
                $query->join('users', 'wajib_retribusi.petugasPendaftarId', '=', 'users.id')
                    ->orderBy('users.namaLengkap', $sortDir)
                    ->select('wajib_retribusi.*');
                break;
            default:
                $query->orderBy($sortBy, $sortDir);
                break;
        }
    }

    private function filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas = null, $getStatus = null, $getPage = null)
    {
        if ($search && trim($search) !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($find) use ($search) {
                    $find->where('namaLengkap', 'like', "%{$search}%");
                })
                    ->orWhereHas('pemilik', function ($find) use ($search) {
                        $find->where('namaPemilik', 'like', "%{$search}%");
                    })
                    ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($getPenanggungJawab) {
            $query->whereHas('pemilik', function ($q) use ($getPenanggungJawab) {
                $q->where('id', $getPenanggungJawab);
            });
        }

        if ($getKategori) {
            $query->whereHas('kategori', function ($q) use ($getKategori) {
                $q->where('kodeKategori', $getKategori);
            });
        }

        if ($getSubKategori) {
            $query->whereHas('subKategori', function ($q) use ($getSubKategori) {
                $q->where('kodeSubKategori', $getSubKategori);
            });
        }

        if ($getKecamatan) {
            $query->whereHas('kecamatan', function ($q) use ($getKecamatan) {
                $q->where('kodeKecamatan', $getKecamatan);
            });
        }

        if ($getKelurahan) {
            $query->whereHas('kelurahan', function ($q) use ($getKelurahan) {
                $q->where('kodeKelurahan', $getKelurahan);
            });
        }

        if ($getPetugas) {
            $query->whereHas('user', function ($q) use ($getPetugas) {
                $q->where('id', $getPetugas);
            });
        };

        if ($getStatus && trim($getStatus) !== '') {
            $query->where('status', $getStatus);
        }
    }

    // private function renderWajibRetribusi(Request $request, string $status = null, $view = 'Index')
    // {
    //     $getSearch = $request->get('search');
    //     $getSortBy = $request->get('sort', 'id');
    //     $getSortDir = $request->get('direction', 'desc');
    //     $getPenanggungJawab = $request->get('pj');
    //     $getKategori = $request->get('kategori');
    //     $getSubKategori = $request->get('sub-kategori');
    //     $getKecamatan = $request->get('kecamatan', Kecamatan::with('uptd')->whereHas('uptd.user', function ($q) {
    //         $q->where('uptdId', Auth::user()->uptdId);
    //     })->first()->kodeKecamatan);
    //     $getKelurahan = $request->get('kelurahan');
    //     $getPetugas = $request->get('petugas');
    //     $getStatus = $request->get('status');
    //     $getPage = $request->get('per_page', 10);

    //     $query = WajibRetribusi::with([
    //         'kategori',
    //         'subKategori',
    //         'kelurahan',
    //         'kecamatan',
    //         'user:id,namaLengkap',
    //         'pemilik',
    //         'uptd'
    //     ])
    //         ->where('wajib_retribusi.uptdId', auth()->user()->uptdId);
    //     // ->where(function ($q) {
    //     //     $q->where('current_role', Auth::user()->role)
    //     //         ->orWhereNull('current_role');
    //     // });

    //     if ($status) {
    //         $query->where('status', $status);
    //     }

    //     $this->sortTable($query, $getSortBy, $getSortDir);
    //     $this->filterData($query, $getSearch, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, $getStatus);

    //     $penanggungJawab = Pemilik::select('id', 'namaPemilik')->get();
    //     $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
    //     $subKategori = $getKategori ? SubKategori::where('kodeKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get() : collect();
    //     $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->whereHas('uptd')->get();
    //     $kelurahan = $getKecamatan ? Kelurahan::where('kodeKecamatan', $getKecamatan)->select('kodeKelurahan', 'namaKelurahan')->get() : collect();

    //     $statusOptions = WajibRetribusi::select('status')
    //         ->distinct()
    //         ->whereNotNull('status')
    //         ->where('status', '!=', '')
    //         ->orderBy('status')
    //         ->pluck('status')
    //         ->map(fn($s) => ['value' => $s, 'label' => $s]);

    //     return Inertia::render("Kuptd/Data-Input/Wajib-Retribusi/{$view}", [
    //         'datas' => $query->paginate($request->get('per_page', 10))->withQueryString(),
    //         'filters' => [
    //             'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
    //             'sort' => $getSortBy,
    //             'direction' => $getSortDir,
    //             'penanggungJawab' => $getPenanggungJawab,
    //             'kategori' => $getKategori,
    //             'subKategori' => $getSubKategori,
    //             'kecamatan' => $getKecamatan,
    //             'kelurahan' => $getKelurahan,
    //             'petugas' => $getPetugas,
    //             'per_page' => (int) $getPage,
    //             'status' => $getStatus && trim($getStatus) !== '' ? $getStatus : null,
    //         ],
    //         'pjOptions' => $penanggungJawab,
    //         'kategoriOptions' => $kategori,
    //         'subKategoriOptions' => $subKategori,
    //         'kecamatanOptions' => $kecamatan,
    //         'kelurahanOptions' => $kelurahan,
    //         'statusOptions' => $statusOptions
    //     ]);
    // }
    private function renderWajibRetribusi(
        Request $request,
        $status = null,
        string $view = 'Index',
        ?callable $extraFilter = null
    ) {
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getPenanggungJawab = $request->get('pj');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getKecamatan = $request->get('kecamatan', Kecamatan::whereHas('uptd', function ($q) {
            $q->where('id', Auth::user()->uptdId);
        })->first()->kodeKecamatan);
        $getKelurahan = $request->get('kelurahan');
        $getPetugas = $request->get('petugas');
        $getStatus = $request->get('status');
        $getPage = $request->get('per_page', 10);


        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ])->where('wajib_retribusi.uptdId', Auth::user()->uptdId);

        if ($status) {
            $query->where('status', $status);
        }

        if ($extraFilter) {
            $extraFilter($query);
        }

        $this->sortTable($query, $getSortBy, $getSortDir);
        $this->filterData($query, $getSearch, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas);

        $penanggungJawab = Pemilik::select('id', 'namaPemilik')->get();
        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $getKategori
            ? SubKategori::where('kodeKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();
        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->get();
        $kelurahan = $getKecamatan
            ? Kelurahan::where('kodeKecamatan', $getKecamatan)->select('kodeKelurahan', 'namaKelurahan')->get()
            : collect();

        $statusOptions = WajibRetribusi::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->where('status', '!=', '')
            ->orderBy('status')
            ->pluck('status')
            ->map(fn($s) => ['value' => $s, 'label' => $s]);

        // $statusOptions = WajibRetribusi::select('status', 'current_role')
        //     ->distinct()
        //     ->whereNotNull('status')
        //     ->where('status', '!=', '')
        //     ->orderBy('status')
        //     ->get()
        //     ->map(function ($item) {
        //         $label = match (true) {
        //             ($item->status === "Processed" && $item->current_role === "ROLE_KUPTD") ||
        //                 ($item->status === "Approved" && $item->current_role === null)
        //             => "Diterima",

        //             $item->status === "Processed" && $item->current_role !== "ROLE_KUPTD"
        //             => "Diproses",

        //             $item->status === "Rejected"
        //             => "Ditolak",

        //             default => $item->status,
        //         };

        //         return [
        //             'value' => $item->status,
        //             'role' => $item->current_role,
        //             'label' => $label,
        //         ];
        //     });

        // dd($query->whereNotNull('current_role')->get());


        return Inertia::render("Kuptd/Data-Input/Wajib-Retribusi/{$view}", [
            'datas' => $query->paginate($getPage)->withQueryString(),
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'penanggungJawab' => $getPenanggungJawab,
                'kategori' => $getKategori,
                'subKategori' => $getSubKategori,
                'kecamatan' => $getKecamatan,
                'kelurahan' => $getKelurahan,
                'petugas' => $getPetugas,
                'per_page' => (int) $getPage,
                'status' => $getStatus
            ],
            'pjOptions' => $penanggungJawab,
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'kecamatanOptions' => $kecamatan,
            'kelurahanOptions' => $kelurahan,
            'statusOptions' => $statusOptions
        ]);
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            "Index",
            function ($q) use ($request) {
                if ($request->get('status') === "Approved") {
                    $q->where(function ($data) {
                        $data->where('status', "Processed")
                            ->where('current_role', "ROLE_KUPTD");
                    })->orWhere(function($data) {
                        $data->where('status', 'Approved')
                            ->whereNull('current_role');
                    });
                }

                if ($request->get('status') === "Processed") {
                    $q->where('status', "Processed")
                        ->where('current_role', '!=', "ROLE_KUPTD");
                }

                if ($request->get('status') === "Rejected") {
                    $q->where('status', "Rejected");
                }

                
            }
        );
    }

    public function diterima(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            "Processed",
            "Diterima",
            fn($q) => $q->where('current_role', 'ROLE_KUPTD')
        );
    }

    public function diproses(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            "Processed",
            "Diproses",
            fn($q) => $q->where(function ($q) {
                $q->where('current_role', '!=', 'ROLE_KUPTD')
                    ->where('status', "Processed")
                    ->orWhereNull('current_role');
            })
        );
    }

    public function ditolak(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            "Rejected",
            "Ditolak",
            fn($q) => $q->where(function ($q) {
                $q->where('current_role', '!=', 'ROLE_KUPTD')
                    ->orWhereNull('current_role');
            })
        );
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
    public function show(WajibRetribusi $retribusi)
    {
        // dd('asdsa');
        $retribusi->load(['pemilik', 'kelurahan', 'kecamatan', 'kategori', 'subKategori', 'uptd']);

        $pemohonOptions = Pemilik::select('id', 'namaPemilik')
            ->orderBy('namaPemilik')
            ->get()
            ->map(fn($pemohon) => ['value' => $pemohon->id, 'label' => $pemohon->namaPemilik]);

        $kecamatanOptions = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
            ->orderBy('namaKecamatan')
            ->get()
            ->map(fn($kecamatan) => ['value' => $kecamatan->kodeKecamatan, 'label' => $kecamatan->namaKecamatan]);

        $kelurahanOptions = Kelurahan::select('kodeKelurahan', 'namaKelurahan', 'kodeKecamatan')
            ->orderBy('namaKelurahan')
            ->get()
            ->groupBy('kodeKecamatan')
            ->map(fn($grouped) => $grouped->map(fn($kelurahan) => [
                'value' => $kelurahan->kodeKelurahan,
                'label' => $kelurahan->namaKelurahan
            ])->values());

        $kategoriOptions = Kategori::select('kodeKategori', 'namaKategori')
            ->orderBy('namaKategori')
            ->get()
            ->map(fn($kategori) => ['value' => $kategori->kodeKategori, 'label' => $kategori->namaKategori]);

        $subKategoriOptions = SubKategori::select('kodeSubKategori', 'namaSubKategori', 'kodeKategori', 'rumus', 'variabel', 'tarif', 'tarif2')
            ->orderBy('namaSubKategori')
            ->get()
            ->groupBy('kodeKategori')
            ->map(fn($grouped) => $grouped->map(fn($sub) => [
                'value' => $sub->kodeSubKategori,
                'label' => $sub->namaSubKategori,
                'rumus' => $sub->rumus,
                'variabel' => $sub->variabel,
                'tarif' => $sub->tarif,
                'tarif2' => $sub->tarif2
            ])->values());

        return Inertia::render("Kuptd/Data-Input/Wajib-Retribusi/Show", [
            'retribusi' => $retribusi,
            'pemohonOptions' => $pemohonOptions,
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kategoriOptions' => $kategoriOptions,
            'subKategoriOptions' => $subKategoriOptions,
        ]);
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
    public function update(Request $request, WajibRetribusi $retribusi)
    {
        $request->validate([
            'status' => 'in:Approved,Rejected,Processed',
            'keterangan' => $request->status === "Rejected" ? "required" : "nullable"
        ], [
            'status.in' => 'Status tidak valid',
            'keterangan.required' => 'Keterangan perlu diisi'
        ]);

        $history = $retribusi->historyAction ?? [];

        $history[] = [
            'role' => Auth::user()->role,
            'action' => $request->status,
            'userId' => Auth::id(),
            'actionDate' => now()->toIso8601String()
        ];

        $retribusi->keterangan = $request->keterangan;
        $retribusi->status = $request->status === "Rejected" ? "Rejected" : "Processed";
        $retribusi->historyAction = $history;
        $retribusi->current_role = $request->status === "Approved" ? "ROLE_KATIM" : "ROLE_PENDAFTAR";
        $retribusi->save();

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getImageFile()
    {
        if ($this->url_image) {
            return Storage::url($this->url_image[0]);
        }
        return null;
    }

    public function getBerkasFile()
    {
        if ($this->url_file) {
            return Storage::url($this->url_file[0]);
        }
        return null;
    }
}
