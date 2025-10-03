<?php

namespace App\Http\Controllers\Kuptd;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use App\Models\SubKategori;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
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

    private function filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas = null, $getStatus = null, $getTahun = null, $getPage = null)
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
            // dd($getKecamatan);
            $query->whereHas('kecamatan', function ($q) use ($getKecamatan) {
                $q->where('kodeKecamatan', $getKecamatan);
            });
        }

        if ($getKelurahan) {
            $query->whereHas('kelurahan', function ($q) use ($getKelurahan) {
                $q->where('kodeKelurahan', $getKelurahan);
            });
        }

        // if ($getPetugas) {
        //     $query->whereHas('user', function ($q) use ($getPetugas) {
        //         $q->where('id', $getPetugas);
        //     });
        // };

        if ($getStatus && trim($getStatus) !== '') {
            $query->where('status', $getStatus);
        }

        if ($getTahun) {
            $query->whereYear('created_at', $getTahun);
        }
    }

    private function renderWajibRetribusi(
        Request $request,
        $status = null,
        string $view = 'Index',
        ?callable $extraFilter = null
    ) {
        // dd(Auth::user()->uptd->kecamatan->kodeKecamatan);
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getPenanggungJawab = $request->get('pj');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getKecamatan = $request->get('kecamatan', Auth::user()->uptd->kecamatan->kodeKecamatan);
        // dd(Auth::user()->uptd->kecamatan->kodeKecamatan);
        $getKelurahan = $request->get('kelurahan');
        $getPetugas = $request->get('petugas');
        $getStatus = $request->get('status');
        $getTahun = $request->get('tahun');
        $getPage = $request->get('per_page', 10);

        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ])->where('kodeKecamatan', Auth::user()->uptd->kecamatan->kodeKecamatan);

        if ($status) {
            $query->where('status', $status);
        }

        if ($extraFilter) {
            $extraFilter($query);
        }

        if ($status && $view !== 'Index') {
            $query->where('status', $status)->whereNull('noWajibRetribusi');
        }

        $this->sortTable($query, $getSortBy, $getSortDir);
        $this->filterData($query, $getSearch, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, null, $getTahun);

        $penanggungJawab = Pemilik::select('id', 'namaPemilik')->get();
        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $getKategori
            ? SubKategori::where('kodeKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();
        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->get();
        $kelurahan = $getKecamatan
            ? Kelurahan::where('kodeKecamatan', $getKecamatan)->select('kodeKelurahan', 'namaKelurahan')->get()
            : collect();

        // $statusOptions = WajibRetribusi::select('status')
        //     ->distinct()
        //     ->whereNotNull('status')
        //     ->where('status', '!=', '')
        //     ->orderBy('status')
        //     ->pluck('status')
        //     ->map(fn($s) => ['value' => $s, 'label' => $s]);
        $statuses = ['Approved', 'Processed', 'Rejected', 'Finished'];
        $statusOptions = collect($statuses)->map(fn($s) => [
            'value' => $s,
            'label' => $s
        ]);

        $tahunOptions = WajibRetribusi::select('created_at')
            ->get()
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->year)
            ->unique()
            ->sortDesc()
            ->values()
            ->map(fn($t) => ['value' => $t, 'label' => $t]);

        $datas = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        return Inertia::render("Kuptd/Data-Input/Wajib-Retribusi/{$view}", [
            'datas' => $datas,
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
                'status' => $getStatus && trim($getStatus) !== '' ? $getStatus : null,
                'tahun' => $getTahun
            ],
            'pjOptions' => $penanggungJawab,
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'kecamatanOptions' => $kecamatan,
            'kelurahanOptions' => $kelurahan,
            'statusOptions' => $statusOptions,
            'tahunOptions' => $tahunOptions,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // return $this->renderWajibRetribusi(
        //     $request,
        //     null,
        //     "Index",
        //     function ($q) use ($request) {
        //         if ($request->get('status') === "Approved") {
        //             $q->where(function ($data) {
        //                 $data->where('status', "Processed")
        //                     ->where('current_role', "ROLE_KUPTD");
        //             })->orWhere(function ($data) {
        //                 $data->where('status', 'Approved')
        //                     ->whereNull('current_role');
        //             });
        //         }

        //         if ($request->get('status') === "Processed") {
        //             $q->where('status', "Processed")
        //                 ->where('current_role', '!=', "ROLE_KUPTD");
        //         }

        //         if ($request->get('status') === "Rejected") {
        //             $q->where('status', "Rejected");
        //         }

        //         if ($request->get('status') === null) {
        //             $q->where(function ($data) {
        //                 $data->where('current_role', '!=', "ROLE_PENDAFTAR")
        //                     ->orWhere('status', "Rejected")
        //                     ->orWhereNull('current_role');
        //             });
        //         }
        //     }
        // );
        return $this->renderWajibRetribusi(
            $request,
            null,
            "Index",
            function ($q) use ($request) {
                if ($request->get('status') === "Approved") {
                    $q->where('status', 'Processed')->where('current_role', 'ROLE_KUPTD');
                }

                if ($request->get('status') === "Processed") {
                    $q->where('status', 'Processed')->where('current_role', '!=', 'ROLE_KUPTD');
                }

                if ($request->get('status') === "Rejected") {
                    $q->where('status', 'Rejected');
                }

                if ($request->get('status') === "Finished") {
                    $q->where(function ($data) {
                        $data->where('status', 'Finished')
                            ->where('current_role', 'ROLE_KABID');
                    })->orWhere(function ($data) {
                        $data->where('status', 'Approved')
                        ->whereNull('current_role');
                    });
                }

                if ($request->get('status') === null) {
                    $q->where(function ($data) {
                        $data->where('current_role', '!=', "ROLE_PENDAFTAR")
                            ->orWhere('status', "Rejected")
                            ->orWhereNull('current_role');
                    });
                }
            }
        );
    }

    public function diterima(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            "Diterima",
            fn($q) => $q->where('status', 'Processed')->where('current_role', 'ROLE_KUPTD')
        );
    }

    public function diproses(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            "Diproses",
            fn($q) => $q->where(function ($q) {
                $q->where('current_role', '!=', 'ROLE_KUPTD')
                    ->where('status', "Processed");
            })
        );
    }

    public function ditolak(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            "Ditolak",
            fn($q) => $q->where(function ($q) {
                $q->where('status', 'Rejected');
                // ->where('current_role', '!=', 'ROLE_KUPTD')
                // ->orWhereNull('current_role');
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
    public function show($status, WajibRetribusi $retribusi)
    {
        $retribusi->load(['pemilik', 'kelurahan', 'kecamatan', 'kategori', 'subKategori', 'uptd', 'user']);

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
            'status' => $status,
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
