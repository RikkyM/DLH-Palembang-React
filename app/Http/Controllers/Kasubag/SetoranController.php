<?php

namespace App\Http\Controllers\Kasubag;

use App\Http\Controllers\Controller;
use App\Models\DetailSetoran;
use App\Models\Setoran;
use App\Models\Skrd;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class SetoranController extends Controller
{
    private function getMetodeBayar()
    {
        $metode = ['Transfer', 'Qris', 'Kliring', 'E-Wallet'];
        return collect($metode)->map(fn($s) => [
            'value' => $s,
            'label' => $s
        ]);
    }

    private function compressToMaxBytes(UploadedFile $file, int $maxBytes = 512_000): array
    {
        $manager = new ImageManager(new Driver());

        $image = $manager->read($file->getRealPath())->orient(); // v3


        $originalExt = strtolower($file->getClientOriginalExtension());
        $encodeAsJpeg = in_array($originalExt, ['jpg', 'jpeg', 'png']);

        $quality = 85;
        $scale = 1.0;

        $encoded = null;
        $mime = '';
        $ext = '';

        do {

            $working = clone $image;

            if ($scale < 1.0) {
                $working = $working->scale($scale * 100);
            }

            if ($encodeAsJpeg) {
                $encoded = $working->encode(new JpegEncoder(quality: $quality));
                $mime = 'image/jpeg';
                $ext = 'jpg';
            }

            $bytes = strlen($encoded->toString());
            if ($bytes <= $maxBytes) break;

            if ($quality > 60) {
                $quality -= 5;
            } else {
                $scale *= 0.90;
            }
        } while ($scale > 0.30);

        return [$encoded->toString(), $ext, $mime];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $sortBy = $request->get('sort', 'nomorNota');
        $sortDir = $request->get('direction', 'desc');
        $getPage = $request->get('per_page', 10);
        $getSkrd = $request->get('skrd');
        $getMetode = $request->get('metode');
        $getTanggal = $request->get('tanggal_bayar');

        $query = Setoran::with(['skrd', 'detailSetoran'])
            ->whereRelation('skrd', 'uptdId', auth()->user()->uptdId);

        if ($getSearch && trim($getSearch) !== '') {
            $query->whereHas('skrd', function ($q) use ($getSearch) {
                $q->where('noSkrd', 'like', "%{$getSearch}%")
                    ->orWhere('namaObjekRetribusi', 'like', "%{$getSearch}%");
            })
                ->orWhere(function ($q) use ($getSearch) {
                    $q->where('nomorNota', 'like', "%{$getSearch}%");
                })
                ->orWhere('namaBank', 'like', "%{$getSearch}%");
        }

        switch ($sortBy) {
            case 'noSkrd':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.noSkrd', $sortDir)
                    ->select('setoran.*');
                break;
            case 'namaObjekRetribusi':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.namaObjekRetribusi', $sortDir)
                    ->select('setoran.*');
                break;
            case 'kecamatan':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.kecamatanObjekRetribusi', $sortDir)
                    ->select('setoran.*');
                break;
            case 'tagihanPerBulanSkrd':
                $query->leftJoin('skrd', 'setoran.skrdId', '=', 'skrd.id')
                    ->orderBy('skrd.tagihanPerBulanSkrd', $sortDir)
                    ->select('setoran.*');
                break;
            default:
                $query->orderBy($sortBy, $sortDir);
                break;
        }

        if (!empty($getSkrd)) {
            $query->where('setoran.skrdId', $getSkrd);
        }

        if ($getMetode) {
            $query->where('metodeBayar', $getMetode);
        }

        if ($getTanggal) {
            $query->whereDate('tanggalBayar', $getTanggal);
        }

        $skrdOptions = Skrd::with('setoran')
            ->where('uptdId', auth()->user()->uptdId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($s) => [
                'value' => (string) $s->id,
                'label' => (string) $s->noSkrd
            ]);

        $datas = $getPage <= 0 ? $query->get() : $query->paginate($getPage)->withQueryString();

        return Inertia::render('Kasubag/Penerimaan/Index', [
            'datas' => Inertia::defer(fn() => $datas),
            'filters' => [
                'search' => ($getSearch && trim($getSearch) === '') ? $getSearch : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'per_page' => (int) $getPage,
                'skrd' => (int) $getSkrd,
                'metode' => $getMetode,
                'tanggal_bayar' => $getTanggal
            ],
            'skrdOptions' => $skrdOptions,
            'metodeOptions' => $this->getMetodeBayar(),
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $skrdOptions = Skrd::with([
            'detailSetoran' => function ($setoran) {
                $setoran->whereHas('setoran', fn($s) => $s->where('status', '!=', 'Rejected')->where('status', '!=', 'Cancelled'));
            }
        ])->select('id', 'noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'alamatObjekRetribusi', 'kecamatanObjekRetribusi', 'kelurahanObjekRetribusi', 'tagihanPerBulanSkrd', 'tagihanPerTahunSkrd', 'jumlahBulan', 'keteranganBulan')
            ->where('uptdId', auth()->user()->uptdId)
            ->whereYear('created_at', '>=', '2025')
            ->orderBy('created_at', 'desc')
            // ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', 1) AS UNSIGNED) ASC")
            // ->orderByRaw("CAST(SUBSTRING_INDEX(noSkrd, '/', -1) AS UNSIGNED) ASC")
            ->withSum(['detailSetoran as totalBayar' => function ($q) {
                // $q->whereHas('setoran', fn($data) => $data->where('status', '!=', "Rejected"));
                $q->whereHas('setoran', fn($s) => $s->where('status', '!=', 'Rejected')->where('status', '!=', 'Cancelled'));
            }], 'jumlahBayar')
            ->whereNotNull('noSkrd')
            ->get()
            ->filter(fn($s) => ($s->tagihanPerTahunSkrd - (int)($s->totalBayar ?? 0)) !== 0)
            ->values()
            ->map(function ($skrd) {
                return [
                    'value' => $skrd->id,
                    'label' => $skrd->noSkrd,
                    'noWajibRetribusi' => $skrd->noWajibRetribusi,
                    'namaObjekRetribusi' => $skrd->namaObjekRetribusi,
                    'alamatObjekRetribusi' => $skrd->alamatObjekRetribusi,
                    'kecamatanObjekRetribusi' => $skrd->kecamatanObjekRetribusi,
                    'kelurahanObjekRetribusi' => $skrd->kelurahanObjekRetribusi,
                    'tagihanPerBulanSkrd' => $skrd->tagihanPerBulanSkrd,
                    'tagihanPerTahunSkrd' => $skrd->tagihanPerTahunSkrd,
                    'jumlahBulan' => $skrd->jumlahBulan,
                    'keteranganBulan' => $skrd->keteranganBulan,
                    'detailSetoran' => $skrd->detailSetoran->map(function ($detailSetoran) {
                        return [
                            'skrdId' => $detailSetoran->skrdId,
                            'nomorNota' => $detailSetoran->nomorNota,
                            'namaBulan' => $detailSetoran->namaBulan,
                            'tanggalBayar' => $detailSetoran->tanggalBayar,
                            'jumlahBayar' => $detailSetoran->jumlahBayar,
                            'keterangan' => $detailSetoran->keterangan
                        ];
                    })
                ];
            });

        // dd($skrdOptions);

        return Inertia::render('Kasubag/Penerimaan/Setoran', [
            'skrdOptions' => $skrdOptions,
            'metodeOptions' => $this->getMetodeBayar(),
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            // $fileBuktiBayar = $request->file('buktiBayar');
            // if ($fileBuktiBayar) {
            //     $namaFileBuktiBayar = Str::uuid() . '.' . $fileBuktiBayar->getClientOriginalExtension();
            //     $fileBuktiBayar->storeAs('bukti-bayar', $namaFileBuktiBayar, 'local');
            //     $filePath = Storage::disk('local')->putFileAs(
            //         'bukti-bayar',
            //         $fileBuktiBayar,
            //         $namaFileBuktiBayar
            //     );
            // }

            $filePath = null;

            if ($request->hasFile('buktiBayar')) {
                [$binary, $ext, $mime] = $this->compressToMaxBytes($request->file('buktiBayar'), 512000);

                $namaFileBuktiBayar = Str::uuid() . '.' . $ext;
                Storage::disk('local')->put("bukti-bayar/{$namaFileBuktiBayar}", $binary);
                $filePath = "bukti-bayar/{$namaFileBuktiBayar}";
            }

            $dataSave = [
                'skrdId'         => $request->noSkrd,
                'noRef'          => $request->noReferensiBank,
                'tanggalBayar'   => $request->tanggalBayar,
                'jumlahBayar'    => $request->jumlahBayar,
                'jumlahBulan'    => $request->jumlahBulanBayar,
                'namaPenyetor'   => $request->namaPengirim,
                'keteranganBulan' => $request->keteranganBulan,
                'metodeBayar'    => $request->metodeBayar,
                'namaBank'       => $request->namaBank,
                'buktiBayar'     => $filePath,
            ];

            $setoran = Setoran::create($dataSave);

            if ($request->detailSetoran) {
                foreach ($request->detailSetoran as $detailSetoran) {
                    DetailSetoran::create([
                        'skrdId' => $request->noSkrd,
                        'nomorNota' => $setoran->nomorNota,
                        'namaBulan' => $detailSetoran['bulan'],
                        'tanggalBayar' => $detailSetoran['tanggalBayar'],
                        'jumlahBayar' => $detailSetoran['jumlah'],
                        'keterangan' => $detailSetoran['keterangan'],
                    ]);
                }
            }
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Setoran $data)
    {
        $data->load(['skrd', 'detailSetoran']);
        return Inertia::render('Kasubag/Penerimaan/Detail', [
            'data' => $data
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
    public function update(Request $request)
    {
        $setoran = Setoran::where('nomorNota', $request->nota)->firstOrFail();
        try {
            DB::transaction(function () use ($setoran) {
                $setoran->update([
                    'current_stage' => 'kuptd'
                ]);
            });
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->withErrors(['server' => 'Terjadi kesalahan ketika memproses setoran']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // public function prosesSetoran(Setoran $data)
    // {
    //     try {
    //         DB::transaction(function () use ($data) {
    //             $data->update([
    //                 'current_stage' => 'kuptd'
    //             ]);
    //         });
    //     } catch (\Exception $e) {
    //         report($e);
    //         return redirect()->back()->withErrors(['server' => 'Terjadi kesalahan ketika memproses setoran.']);
    //     }
    // }
}
