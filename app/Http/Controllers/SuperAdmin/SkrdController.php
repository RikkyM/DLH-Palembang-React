<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Exports\SkrdExport;
use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\SubKategori;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SkrdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');

        $kategoriId = $request->get('kategori');
        $subKategoriId = $request->get('sub-kategori');
        $petugasId = $request->get('petugas');

        $skrd = Skrd::with(['user:id,namaLengkap,lokasi', 'pembayaran' => function ($q) {
            $q->orderBy('tanggalBayar');
        }])->withSum('pembayaran', 'jumlahBayar');

        if ($sortBy === 'user.namaLengkap') {
            $skrd->addSelect([
                'skrd.*',
                'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                ->whereColumn('skrdId', 'skrd.id')
            ])
                ->join('users', 'skrd.petugasPendaftarId', '=', 'users.id')
                ->orderBy('users.namaLengkap', $sortDir);
        } else {
            $skrd->withSum('pembayaran', 'jumlahBayar');

            if ($sortBy === 'sisa_tertagih') {
                $skrd->orderByRaw("(tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) {$sortDir}");
            } elseif ($sortBy === 'statusLunas') {
                $skrd->orderByRaw("CASE WHEN (tagihanPerTahunSkrd - COALESCE(pembayaran_sum_jumlah_bayar, 0)) = 0 THEN 0 ELSE 1 END {$sortDir}");
            } else {
                $skrd->orderBy($sortBy, $sortDir);
            }
        }

        if ($sortBy === 'sisa_tertagih') {
        }

        if ($search && trim($search) !== '') {
            $skrd->where(function ($q) use ($search) {
                $q->whereHas('user', function ($query) use ($search) {
                    $query->where('namaLengkap', 'like', "%{$search}%");
                })->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($kategoriId) {
            $skrd->where('namaKategori', $kategoriId);
        }

        if ($subKategoriId) {
            $skrd->where('namaSubKategori', $subKategoriId);
        }

        if ($petugasId) {
            $skrd->where('petugasPendaftarId', $petugasId);
        }

        $kategori = Kategori::select('kodeKategori', 'namaKategori')->get();
        $subKategori = $kategoriId ?
            SubKategori::whereHas('kategori', function ($query) use ($kategoriId) {
                $query->where('namaKategori', $kategoriId);
            })->select('kodeSubKategori', 'namaSubKategori')->get()
            : collect();
        $petugas = User::select('id', 'namaLengkap', 'lokasi')->where('role', 'ROLE_PENDAFTAR')->orderBy('namaLengkap')->get();

        return Inertia::render('Super-Admin/Data-Input/Skrd/Index', [
            'datas' => $skrd->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir,
                'kategori' => $kategoriId,
                'subKategori' => $subKategoriId,
                'petugas' => $petugasId
            ],
            'kategoriOptions' => $kategori,
            'subKategoriOptions' => $subKategori,
            'petugasOptions' => $petugas
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Skrd $skrd)
    {
        return Inertia::render('Super-Admin/Data-Input/Skrd/Show/Index', [
            'skrd' => Skrd::with(['user', 'pembayaran'])
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function downloadSinglePdf($id)
    {
        $data = Skrd::with(['user:id,namaLengkap,lokasi', 'pembayaran'])->findOrFail($id);

        $pdf = Pdf::loadView('exports.skrd.skrd-single-pdf', compact('data'))
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        return $pdf->stream("skrd-{$data->noWajibRetribusi}.pdf");
    }

    public function downloadSingleExcel($id)
    {
        return Excel::download(new SkrdExport($id), 'skrd-' . $id . '.xlsx');
    }

}
