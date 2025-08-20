<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\WajibRetribusiRequest;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use App\Models\SubKategori;
use App\Models\Uptd;
use App\Models\User;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
                $q->where('id', $getPetugas);
            });
        };

        if ($getStatus && trim($getStatus) !== '') {
            $query->where('status', $getStatus);
        }

        if ($getTahun) {
            $query->whereYear('created_at', $getTahun);
        }
    }

    private function renderWajibRetribusi(Request $request, string $status = null, string $view = 'Index')
    {
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

        // if ($status) {
        //     $query->where('status', $status);
        // }

        if ($status && $view !== 'Index') {
            $query->where('status', $status)->whereNull('noWajibRetribusi');
        }

        $this->sortTable($query, $sortBy, $sortDir);
        $this->filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, $getStatus, $getTahun);

        $penanggungJawab = Pemilik::select('id', 'namaPemilik')->get();
        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $getKategori ? SubKategori::where('kodeKategori', $getKategori)->select('kodeSubKategori', 'namaSubKategori')->get() : collect();
        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')->get();
        $kelurahan = $getKecamatan ? Kelurahan::where('kodeKecamatan', $getKecamatan)->select('kodeKelurahan', 'namaKelurahan')->get() : collect();
        $petugas = User::select('id', 'namaLengkap')->where('role', 'ROLE_PENDAFTAR')->get();

        $statusOptions = WajibRetribusi::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->where('status', '!=', '')
            ->orderBy('status')
            ->pluck('status')
            ->map(fn($s) => ['value' => $s, 'label' => $s]);

        $tahunOptions = WajibRetribusi::select('created_at')
            ->get()
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->year)
            ->unique()
            ->sortDesc()
            ->values()
            ->map(fn($t) => ['value' => $t, 'label' => $t]);

        return Inertia::render("Super-Admin/Data-Input/Wajib-Retribusi/{$view}", [
            'datas' => $query->paginate($request->get('per_page', 10))->withQueryString(),
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
            'tahunOptions' => $tahunOptions
        ]);
    }

    public function index(Request $request)
    {
        return $this->renderWajibRetribusi($request, null);
    }

    public function diterima(Request $request)
    {
        return $this->renderWajibRetribusi($request, 'Approved', 'Diterima');
    }

    public function diproses(Request $request)
    {
        return $this->renderWajibRetribusi($request, 'Processed', 'Diproses');
    }

    public function ditolak(Request $request)
    {
        return $this->renderWajibRetribusi($request, 'Rejected', 'Ditolak');
    }

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

        $kategoriOptions = Kategori::select('kodeKategori', 'namaKategori')
            ->orderBy('namaKategori')
            ->get()
            ->map(function ($kategori) {
                return [
                    'value' => $kategori->kodeKategori,
                    'label' => $kategori->namaKategori
                ];
            });

        $subKategoriOptions = SubKategori::select('kodeSubKategori', 'namaSubKategori', 'kodeKategori', 'rumus', 'variabel', 'tarif', 'tarif2')
            ->orderBy('namaSubKategori')
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

        return Inertia::render('Super-Admin/Data-Input/Wajib-Retribusi/Create', [
            'pemohonOptions' => $pemohonOptions,
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kategoriOptions' => $kategoriOptions,
            'subKategoriOptions' => $subKategoriOptions
        ]);
    }

    public function store(WajibRetribusiRequest $request)
    {
        $validated = $request->validated();

        $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

        $jenisTarif = $validated['jenisTarif'] ?? "tarif";
        $tarif = $sub->{$jenisTarif} ?? 0;
        $rumus = $sub->rumus ?? '';


        $tarifPerbulan = $tarif;

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
                $tarifPerbulan = $tarif * $nilaiRumus;

                // dd($tarifPerbulan);
            } catch (\Throwable $e) {
                return back()->withErrors(['variabelValues' => 'Rumus tidak valid: ' . $e->getMessage()]);
            }
        } else {
            $tarifPerbulan = $validated['variabelValues']['bulan'] * $tarif;
        }


        DB::beginTransaction();

        try {
            $fileFotoBangunan = $request->file('fotoBangunan');
            $fileFotoBerkas = $request->file('fotoBerkas');

            $fotoBangunan = Str::uuid() . '.' . $fileFotoBangunan->getClientOriginalExtension();
            $fotoBerkas = Str::uuid() . '.' . $fileFotoBerkas->getClientOriginalExtension();

            $pathFotoBangunan = $fileFotoBangunan->storeAs('foto/bangunan', $fotoBangunan, 'local');
            $pathFotoBerkas = $fileFotoBerkas->storeAs('foto/berkas', $fotoBerkas, 'local');

            $uptd = Uptd::where('kodeKecamatan', $request->kodeKecamatan)->firstOrFail();

            $dataToSave = [
                'kodeKategori' => $request->kodeKategori,
                'kodeSubKategori' => $request->kodeSubKategori,
                'kodeKelurahan' => $request->kodeKelurahan,
                'kodeKecamatan' => $request->kodeKecamatan,
                'uptdId' => $uptd->id,
                'pemilikId' => $request->pemilikId,
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
                'url_image' => [Storage::url($pathFotoBangunan)],
                'file' => $fotoBerkas,
                'url_file' => [Storage::url($pathFotoBerkas)],
                'linkMap' => $request->linkMap,
                'tarifPerbulan' => $tarifPerbulan,
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

            WajibRetribusi::create($dataToSave);

            DB::commit();
            return redirect()->route('super-admin.wajib-retribusi.index')->with('success', 'Data berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data.']);
        }
    }

    public function edit(WajibRetribusi $retribusi)
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

        return Inertia::render("Super-Admin/Data-Input/Wajib-Retribusi/Edit", [
            'retribusi' => $retribusi,
            'pemohonOptions' => $pemohonOptions,
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions,
            'kategoriOptions' => $kategoriOptions,
            'subKategoriOptions' => $subKategoriOptions,
        ]);
    }

    public function update(WajibRetribusiRequest $request, $id)
    {

        $validated = $request->validated();

        $retribusi = WajibRetribusi::findOrFail($id);

        $tarifPerbulan = $retribusi->tarifPerbulan;

        if ($request->filled('variabelValues') || $request->filled('bulan')) {
            $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

            $tarif = $sub->tarif;
            $rumus = $sub->rumus ?? '';

            if (!empty($validated['variabelValues']) && $rumus) {
                $validated['variabelValues']['bulan'] = $request->input('bulan');
                foreach ($validated['variabelValues'] as $key => $value) {
                    $rumus = preg_replace('/\b' . preg_quote($key) . '\b/', $value, $rumus);
                }

                try {
                    $nilaiRumus = 0;
                    eval("\$nilaiRumus = $rumus;");
                    $tarifPerbulan = $tarif * $nilaiRumus;
                } catch (\Throwable $e) {
                    return back()->withErrors(['variabelValues' => 'Rumus tidak valid: ' . $e->getMessage()]);
                }
            } else {
                $tarifPerbulan = $request->input('bulan') * $tarif;
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
                'file' => $fotoBerkas,
                'url_file' => $pathFotoBerkas,
                'linkMap' => $request->linkMap,
                'tarifPerbulan' => $tarifPerbulan,
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

            // dd($dataToUpdate);

            $retribusi->update($dataToUpdate);

            DB::commit();

            return redirect()->route('super-admin.wajib-retribusi-diterima')->with('success', 'Data berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            // dd($e);
            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data.']);
        }

        // dd("total: Rp." . number_format($this->rumus($validated), 0, ',', '.'));
    }

    public function sendDiterima($id)
    {
        $retribusi = WajibRetribusi::findOrFail($id);

        $history = $retribusi->historyAction ?? [];

        $history[] = [
            'role' => Auth::user()->role,
            'action' => 'Send',
            'userId' => Auth::user()->id,
            'actionDate' => now()->toIso8601String()
        ];

        $retribusi->status = 'Processed';
        $retribusi->historyAction = $history;
        $retribusi->current_role = "ROLE_KUPTD";
        $retribusi->save();

        return redirect()->back()->with('success', 'Retribusi berhasil dikirim.');
    }
}
