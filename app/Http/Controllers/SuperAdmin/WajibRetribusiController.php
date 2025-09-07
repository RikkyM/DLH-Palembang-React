<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\WajibRetribusiRequest;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use App\Models\Penagih;
use App\Models\SubKategori;
use App\Models\Uptd;
use App\Models\User;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WajibRetribusiController extends Controller
{

    private function rumus($validated)
    {
        $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

        $tarif = $sub->tarif;
        $rumus = $sub->rumus ?? '';

        if (!empty($validated['variabelValues']) && $rumus) {
            foreach ($validated['variabelValues'] as $key => $value) {
                $rumus = preg_replace('/\b' . preg_quote($key) . '\b/', $value, $rumus);
            }

            try {
                $nilaiRumus = 0;
                eval("\$nilaiRumus = $rumus;");
                return $tarif * $nilaiRumus;
            } catch (\Throwable $e) {
                return back()->withErrors(['variabelValues' => 'Rumus tidak valid: ' . $e->getMessage()]);
            }
        }

        return $tarif;
    }

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

    private function filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, $getStatus, $getTahun = null, $getPage = null)
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
                $q->where('namaLengkap', $getPetugas);
            });
        };

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
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'desc');
        $getPenanggungJawab = $request->get('pj');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getKecamatan = $request->get('kecamatan');
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
        ]);

        if ($status) {
            $query->where('status', $status);
        }

        if ($extraFilter) {
            $extraFilter($query);
        }

        if ($status && $view !== 'Index') {
            $query->where('status', $status)->whereNull('noWajibRetribusi');
        }

        $this->sortTable($query, $sortBy, $sortDir);
        $this->filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, null, $getTahun);

        $penanggungJawab = Pemilik::select('id', 'namaPemilik')->get();
        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = Inertia::lazy(fn() => $getKategori ? SubKategori::where('kodeKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get() : collect());
        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->get();
        $kelurahan = $getKecamatan ? Kelurahan::where('kodeKecamatan', $getKecamatan)->select('kodeKelurahan', 'namaKelurahan')->get() : collect();
        $petugas = User::select('namaLengkap')->where('role', 'ROLE_PENDAFTAR')->distinct()->get();

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

        if ($getPage <= 0) {
            $datas = $query->get();
        } else {
            $datas = $query->paginate($getPage)->withQueryString();
        }

        return Inertia::render("Super-Admin/Data-Input/Wajib-Retribusi/{$view}", [
            'datas' => $datas,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
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
            'petugasOptions' => $petugas,
            'statusOptions' => $statusOptions,
            'tahunOptions' => $tahunOptions,
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
                    $q->where('status', 'Approved')->whereNotNull('current_role');
                }

                if ($request->get('status') === "Processed") {
                    $q->where('status', 'Processed');
                }

                if ($request->get('status') === "Rejected") {
                    $q->where('status', 'Rejected');
                }

                if ($request->get('status') === "Finished") {
                    $q->where('status', 'Approved')->orWhere('current_role', 'ROLE_KABID')->orWhereNull('current_role');
                }
            }
        );
    }

    public function diterima(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            'Diterima',
            fn($q) => $q->where(function ($data) {
                $data->where('status', 'Approved')
                    ->where('current_role', 'ROLE_PENDAFTAR');
            })
        );
    }

    public function diproses(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            'Diproses',
            fn($q) => $q->where(function ($data) {
                $data->where('status', 'Processed')
                    ->where('current_role', '!=', 'ROLE_PENDAFTAR');
            })
        );
    }

    public function ditolak(Request $request)
    {
        return $this->renderWajibRetribusi(
            $request,
            null,
            'Ditolak',
            fn($q) => $q->where(function ($data) {
                $data->where('status', 'Rejected');
            })
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $pemohonOptions = Pemilik::select('id', 'namaPemilik')
            ->orderBy('namaPemilik')
            ->get()
            ->map(function ($pemohon) {
                return [
                    'value' => $pemohon->id,
                    'label' => $pemohon->namaPemilik
                ];
            });

        $kecamatanOptions = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
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

        $kategoriOptions = Kategori::select('kodeKategori', 'namaKategori')
            ->get()
            ->map(function ($kategori) {
                return [
                    'value' => $kategori->kodeKategori,
                    'label' => $kategori->namaKategori
                ];
            });

        $subKategoriOptions = SubKategori::select('kodeSubKategori', 'namaSubKategori', 'kodeKategori', 'rumus', 'variabel', 'tarif', 'tarif2')
            ->get()
            ->groupBy('kodeKategori')
            ->map(function ($groupedSubKategori) {
                return $groupedSubKategori->map(function ($subKategori) {
                    return [
                        'value' => $subKategori->kodeSubKategori,
                        'label' => $subKategori->namaSubKategori,
                        'rumus' => $subKategori->rumus,
                        'variabel' => $subKategori->variabel,
                        'tarif' => $subKategori->tarif,
                        'tarif2' => $subKategori->tarif2
                    ];
                })->values();
            });

        $penagihOptions = Penagih::select('id', 'nama')
            ->orderBy('id')
            ->get()
            ->map(function ($penagih) {
                return [
                    'value' => $penagih->id,
                    'label' => $penagih->nama
                ];
            });

        return Inertia::render('Super-Admin/Data-Input/Wajib-Retribusi/Create', [
            'pemohonOptions' => $pemohonOptions,
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kategoriOptions' => $kategoriOptions,
            'subKategoriOptions' => $subKategoriOptions,
            'penagihOptions' => $penagihOptions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WajibRetribusiRequest $request)
    {
        $validated = $request->validated();

        $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

        $jenisTarif = $validated['jenisTarif'] ?? "tarif";
        $tarif = $sub->{$jenisTarif} ?? 0;
        $rumus = $sub->rumus ?? '';

        $tarifPertahun = $tarif;

        if (!empty($validated['variabelValues']) && $rumus) {
            // $validated['variabelValues']['bulan'] = $request->input('bulan');
            // dd($validated);
            foreach ($validated['variabelValues'] as $key => $value) {
                $rumus = preg_replace('/\b' . preg_quote($key) . '\b/', $value, $rumus);
            }

            // dd($rumus);

            try {
                $nilaiRumus = 0;
                eval("\$nilaiRumus = $rumus;");
                $tarifPertahun = $validated['variabelValues']['bulan'] * $tarif * $nilaiRumus;

                // dd($tarifPertahun);
            } catch (\Throwable $e) {
                return back()->withErrors(['variabelValues' => 'Rumus tidak valid: ' . $e->getMessage()]);
            }
        } else {
            $tarifPertahun = $validated['variabelValues']['bulan'] * $tarif;
        }


        DB::beginTransaction();

        try {
            $fileFotoBangunan = $request->file('fotoBangunan');
            $fileFotoBerkas = $request->file('fotoBerkas');

            $fotoBangunan = Str::uuid() . '.' . $fileFotoBangunan->getClientOriginalExtension();
            $pathFotoBangunan = $fileFotoBangunan->storeAs('foto/bangunan', $fotoBangunan, 'local');

            if (!empty($request->file('fotoBerkas'))) {
                $fotoBerkas = Str::uuid() . '.' . $fileFotoBerkas->getClientOriginalExtension();
                $pathFotoBerkas = [$fileFotoBerkas->storeAs('foto/berkas', $fotoBerkas, 'local')];
            }

            $uptd = Uptd::where('kodeKecamatan', $request->kodeKecamatan)->firstOrFail();

            $dataToSave = [
                'kodeKategori' => $request->kodeKategori,
                'kodeSubKategori' => $request->kodeSubKategori,
                'kodeKelurahan' => $request->kodeKelurahan,
                'kodeKecamatan' => $request->kodeKecamatan,
                'uptdId' => $uptd->id,
                'pemilikId' => $request->pemilikId,
                'penagihId' => $request->penagihId,
                'petugasPendaftarId' => Auth::user()->id,
                'namaObjekRetribusi' => $request->namaObjekRetribusi,
                'deskripsiUsaha' => $request->deskripsi,
                'bentukBadanUsaha' => $request->bentukUsaha,
                'alamat' => $request->alamatObjekRetribusi,
                'rt' => $request->rt,
                'rw' => $request->rw,
                'kota' => 'Palembang',
                'provinsi' => 'Sumatera Selatan',
                'statusTempat' => $request->statusTempat,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'image' => $fotoBangunan,
                'url_image' => [$pathFotoBangunan],
                'file' => $fotoBerkas ?? null,
                'url_file' => !empty($pathFotoBerkas) ? array_map(function ($path) {
                    return Storage::url($path);
                }, $pathFotoBerkas) : [],
                'linkMap' => $request->linkMap,
                'jenisTarif' => $request->jenisTarif,
                'bulan' => $validated['variabelValues']['bulan'],
                'keteranganBulan' => strtoupper($request->keteranganBulan),
                'tanggalSkrd' => $request->tanggalSkrd,
                'unit' => $validated['variabelValues']['unit'] ?? null,
                'm2' => $validated['variabelValues']['m2'] ?? null,
                'giat' => $validated['variabelValues']['giat'] ?? null,
                'hari' => $validated['variabelValues']['hari'] ?? null,
                'meter' => $validated['variabelValues']['meter'] ?? null,
                'tarifPerbulan' => $request->tarifRetribusi,
                'tarifPertahun' => $tarifPertahun,
                'jumlahBangunan' => $request->jBangunan,
                'jumlahLantai' => $request->jLantai,
                'maksud' => "Wajib Retribusi Baru",
                'status' => "Approved",
                "current_role" => "ROLE_PENDAFTAR",
                'createdThisYear' => now()->year == now()->year ? 't' : 'f',
                'historyAction' => [
                    [
                        'role' => Auth::user()->role,
                        'action' => 'Submited',
                        'userId' => Auth::id(),
                        'actionDate' => now()->toIso8601String()
                    ]
                ]
            ];

            // dd($dataToSave);

            // dd($dataToSave, $request->all());

            WajibRetribusi::create($dataToSave);

            DB::commit();
            return redirect()->route('super-admin.wajib-retribusi.index')->with('success', 'Data berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Gagal simpan Wajib Retribusi', [
                'time' => Carbon::now()->toDateTimeString(),
                'user_id' => Auth::id(),
                'route' => request()->path(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.']);
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
    public function edit($status, WajibRetribusi $retribusi)
    {
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
                'tarif2' => $sub->tarif2,
            ])->values());

        $penagihOptions = Penagih::select('id', 'nama')
            ->orderBy('id')
            ->get()
            ->map(function ($penagih) {
                return [
                    'value' => $penagih->id,
                    'label' => $penagih->nama
                ];
            });

        return Inertia::render("Super-Admin/Data-Input/Wajib-Retribusi/Edit", [
            'status' => $status,
            'retribusi' => $retribusi,
            'userRole' => Auth::user()->role,
            'pemohonOptions' => $pemohonOptions,
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kategoriOptions' => $kategoriOptions,
            'subKategoriOptions' => $subKategoriOptions,
            'penagihOptions' => $penagihOptions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WajibRetribusiRequest $request, $id)
    {
        $validated = $request->validated();

        $retribusi = WajibRetribusi::findOrFail($id);

        $tarifPertahun = $request->totalRetribusi;

        // dd($tarifPertahun);

        if ($request->filled('variabelValues') || $request->filled('bulan')) {
            $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

            $jenisTarif = $request->jenisTarif;
            $tarif = $sub->{$jenisTarif} ?? 0;
            $rumus = $sub->rumus ?? '';

            if (!empty($validated['variabelValues']) && $rumus) {
                foreach ($validated['variabelValues'] as $key => $value) {
                    $rumus = preg_replace('/\b' . preg_quote($key) . '\b/', $value, $rumus);
                }

                try {
                    $nilaiRumus = 0;
                    eval("\$nilaiRumus = $rumus;");
                    $tarifPertahun = $validated['variabelValues']['bulan'] * $tarif * $nilaiRumus;
                } catch (\Throwable $e) {
                    return back()->withErrors(['variabelValues' => 'Rumus tidak valid: ' . $e->getMessage()]);
                }
            } else {
                $tarifPertahun = $validated['variabelValues']['bulan'] * $tarif;
            }
        }

        DB::beginTransaction();

        try {
            $fotoBangunan = $retribusi->image;
            $fotoBerkas = $retribusi->file;
            $pathFotoBangunan = $retribusi->url_image ?? [];
            $pathFotoBerkas = $retribusi->url_file ?? [];

            if ($request->hasFile('fotoBangunan')) {
                $fileFotoBangunan = $request->file('fotoBangunan');
                $fotoBangunan = Str::uuid() . '.' . $fileFotoBangunan->getClientOriginalExtension();
                $pathFotoBangunan = [Storage::url($fileFotoBangunan->storeAs('foto/bangunan', $fotoBangunan, 'local'))];
            }

            if ($request->hasFile('fotoBerkas')) {
                $fileFotoBerkas = $request->file('fotoBerkas');
                $fotoBerkas = Str::uuid() . '.' . $fileFotoBerkas->getClientOriginalExtension();
                $pathFotoBerkas = [Storage::url($fileFotoBerkas->storeAs('foto/berkas', $fotoBerkas, 'local'))];
            }

            $uptd = Uptd::where('kodeKecamatan', $request->kodeKecamatan)->firstOrFail();

            $dataToUpdate = [
                'kodeKategori' => $request->kodeKategori,
                'kodeSubKategori' => $request->kodeSubKategori,
                'kodeKelurahan' => $request->kodeKelurahan,
                'kodeKecamatan' => $request->kodeKecamatan,
                'uptdId' => $uptd->id,
                'pemilikId' => $request->pemilikId,
                'penagihId' => $request->penagihId,
                'petugasPendaftarId' => Auth::user()->id,
                'namaObjekRetribusi' => $request->namaObjekRetribusi,
                'deskripsiUsaha' => $request->deskripsi,
                'bentukBadanUsaha' => $request->bentukUsaha,
                'alamat' => $request->alamatObjekRetribusi,
                'rt' => $request->rt,
                'rw' => $request->rw,
                'kota' => 'Palembang',
                'provinsi' => 'Sumatera Selatan',
                'statusTempat' => $request->statusTempat,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'image' => $fotoBangunan,
                'url_image' => $pathFotoBangunan,
                'file' => $fotoBerkas ?? null,
                'url_file' => $pathFotoBerkas,
                'linkMap' => $request->linkMap,
                'jenisTarif' => $request->jenisTarif,
                'bulan' => $validated['variabelValues']['bulan'],
                'keteranganBulan' => strtoupper($request->keteranganBulan),
                'tanggalSkrd' => $request->tanggalSkrd ? Carbon::parse($request->tanggalSkrd)->format('Y-m-d') : null,
                'unit' => $validated['variabelValues']['unit'] ?? null,
                'm2' => $validated['variabelValues']['m2'] ?? null,
                'giat' => $validated['variabelValues']['giat'] ?? null,
                'hari' => $validated['variabelValues']['hari'] ?? null,
                'meter' => $validated['variabelValues']['meter'] ?? null,
                'tarifPerbulan' => $request->tarifRetribusi,
                'tarifPertahun' => $tarifPertahun,
                'jumlahBangunan' => $request->jBangunan,
                'jumlahLantai' => $request->jLantai,
                'historyAction' => array_merge($retribusi->historyAction ?? [], [
                    [
                        'role' => Auth::user()->role,
                        'action' => 'Updated',
                        'userId' => Auth::id(),
                        'actionDate' => now()->toIso8601String()
                    ]
                ])
            ];

            // dd($retribusi);
            // dd($dataToUpdate);

            $retribusi->update($dataToUpdate);

            DB::commit();

            if ($retribusi->status === "Rejected") {
                return redirect()->route('super-admin.wajib-retribusi.ditolak')->with('success', 'Data berhasil diperbarui.');
            } else {
                return redirect()->route('super-admin.wajib-retribusi.diterima')->with('success', 'Data berhasil diperbarui.');
            }
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Update Wajib Wajib Retribusi gagal', [
                'id' => $id,
                'time' => Carbon::now()->toDateTimeString(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.']);
        }

        // dd("total: Rp." . number_format($this->rumus($validated), 0, ',', '.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function send($id)
    {
        $retribusi = WajibRetribusi::findOrFail($id);

        $history = $retribusi->historyAction ?? [];

        $history[] = [
            'role' => Auth::user()->role,
            'action' => 'Send',
            'userId' => Auth::user()->id,
            'actionDate' => now()->toIso8601String()
        ];

        if (empty($retribusi->noWajibRetribusi)) {
            $retribusi->noWajibRetribusi = WajibRetribusi::generateNoWajibRetribusi();
        }
        $retribusi->status = 'Processed';
        $retribusi->historyAction = $history;
        $retribusi->current_role = "ROLE_KUPTD";
        $retribusi->save();

        return redirect()->back()->with('success', 'Retribusi berhasil dikirim.');
    }
}
