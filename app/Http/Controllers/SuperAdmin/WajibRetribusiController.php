<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Exports\WajibRetribusiExport;
use App\Exports\WajibRetribusiSingleExport;
use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use App\Models\SubKategori;
use App\Models\Uptd;
use App\Models\User;
use App\Models\WajibRetribusi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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

    private function filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, $getStatus)
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

    private function renderWajibRetribusi(Request $request, string $status = null, string $view = 'Index')
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');
        $getPenanggungJawab = $request->get('pj');
        $getKategori = $request->get('kategori');
        $getSubKategori = $request->get('sub-kategori');
        $getKecamatan = $request->get('kecamatan');
        $getKelurahan = $request->get('kelurahan');
        $getPetugas = $request->get('petugas');
        $getStatus = $request->get('status');

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

        $this->sortTable($query, $sortBy, $sortDir);
        $this->filterData($query, $search, $getPenanggungJawab, $getKategori, $getSubKategori, $getKecamatan, $getKelurahan, $getPetugas, $getStatus);

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
                'per_page' => (int) $request->get('per_page', 10),
                'status' => $getStatus && trim($getStatus) !== '' ? $getStatus : null,
            ],
            'pjOptions' => $penanggungJawab,
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'kecamatanOptions' => $kecamatan,
            'kelurahanOptions' => $kelurahan,
            'petugasOptions' => $petugas,
            'statusOptions' => $statusOptions
        ]);
    }

    public function index(Request $request)
    {
        return $this->renderWajibRetribusi($request, null, 'Index');
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

        $subKategoriOptions = SubKategori::select('kodeSubKategori', 'namaSubKategori', 'kodeKategori', 'rumus', 'variabel')
            ->orderBy('namaSubKategori')
            ->get()
            ->groupBy('kodeKategori')
            ->map(function ($groupedSubKategori) {
                return $groupedSubKategori->map(function ($subKategori) {
                    return [
                        'value' => $subKategori->kodeSubKategori,
                        'label' => $subKategori->namaSubKategori,
                        'rumus' => $subKategori->rumus,
                        'variabel' => $subKategori->variabel
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaObjekRetribusi' => 'required|string',
            'pemilikId' => 'required',
            'alamatObjekRetribusi' => 'required|string',
            'rt' => 'required',
            'rw' => 'required',
            'kodeKecamatan' => 'required',
            'kodeKelurahan' => 'required',
            'bentukUsaha' => 'required',
            'deskripsi' => 'required',
            'kodeKategori' => 'required',
            'kodeSubKategori' => 'required',
            'statusTempat' => 'required',
            'jBangunan' => 'required',
            'jLantai' => 'required',
            'linkMap' => 'required|url',
            'latitude' => 'required',
            'longitude' => 'required',
            'fotoBangunan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'fotoBerkas' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'variabelValues' => 'required|array',
        ]);

        $sub = SubKategori::where('kodeSubKategori', $validated['kodeSubKategori'])->firstOrFail();

        $tarif = $sub->tarif;
        $rumus = $sub->rumus ?? '';

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

        DB::beginTransaction();

        try {
            $fileFotoBangunan = $request->file('fotoBangunan');
            $fileFotoBerkas = $request->file('fotoBerkas');

            $fotoBangunan = Str::uuid() . '.' . $fileFotoBangunan->getClientOriginalExtension();
            $fotoBerkas = Str::uuid() . '.' . $fileFotoBerkas->getClientOriginalExtension();

            $pathFotoBangunan = $fileFotoBangunan->storeAs('foto/bangunan', $fotoBangunan, 'public');
            $pathFotoBerkas = $fileFotoBerkas->storeAs('foto/berkas', $fotoBerkas, 'public');

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
                'image' => $pathFotoBangunan,
                'url_image' => json_encode(Storage::url($pathFotoBangunan)),
                'file' => $pathFotoBerkas,
                'url_file' => json_encode(Storage::url($pathFotoBerkas)),
                'tarifPerbulan' => $tarifPerbulan,
                'jumlahBangunan' => $request->jBangunan,
                'jumlahLantai' => $request->jLantai,
                'maksud' => "Wajib Retribusi Baru",
                'status' => "Processed",
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

            WajibRetribusi::create($dataToSave);

            DB::commit();
            return redirect()->route('super-admin.wajib-retribusi.index')->with('success', 'Data berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data.']);
        }
    }

    public function edit($id) {}

    public function downloadPdf(Request $request)
    {
        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ]);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($q2) => $q2->where('namaLengkap', 'like', "%{$search}%"))
                    ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($kategori = $request->kategori) {
            $query->whereHas('kategori', fn($q) => $q->where('kodeKategori', $kategori));
        }

        if ($subKategori = $request->{'sub-kategori'}) {
            $query->whereHas('subKategori', fn($q) => $q->where('kodeSubKategori', $subKategori));
        }

        if ($kecamatan = $request->kecamatan) {
            $query->whereHas('kecamatan', fn($q) => $q->where('kodeKecamatan', $kecamatan));
        }

        if ($kelurahan = $request->kelurahan) {
            $query->whereHas('kelurahan', fn($q) => $q->where('kodeKelurahan', $kelurahan));
        }

        if ($petugas = $request->petugas) {
            $query->whereHas(
                'user',
                fn($q) => $q->where('id', $petugas)
            );
        }

        if ($status = $request->status) {
            $query->where('status', $status);
        }

        $data = $query->get();

        $pdf = Pdf::loadView('exports.wajib-retribusi.wajib-retribusi-pdf', compact('data'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d-H-i-s') . '.pdf';

        return $pdf->download($fileName);
    }

    public function export(Request $request)
    {
        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new WajibRetribusiExport($request),
            $fileName
        );
    }

    public function exportSingle($id)
    {
        $export = new WajibRetribusiSingleExport($id);
        return Excel::download($export, 'wajib-retribusi-' . $id . '.xlsx');
    }
}
