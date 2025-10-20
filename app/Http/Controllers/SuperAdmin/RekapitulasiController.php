<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\DetailSetoran;
use App\Models\Invoice;
use App\Models\Pembayaran;
use App\Models\Setoran;
use App\Models\Skrd;
use App\Models\Uptd;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RekapitulasiController extends Controller
{
    private function getBulan()
    {
        Carbon::setLocale('id');

        return collect(range(1, 12))
            ->map(fn($i) => strtoupper(Carbon::create()->month($i)->translatedFormat('F')));
    }

    public function spkrd(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $pembayaranSubquery = DB::table('pembayaran as p')
            ->selectRaw('p.skrdId, SUM(p.jumlahBayar) as totalPembayaran')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween(DB::raw('DATE(p.tanggalBayar)'), [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where(DB::raw('DATE(p.tanggalBayar)'), '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where(DB::raw('DATE(p.tanggalBayar)'), '<=', $endDate))
            ->groupBy('p.skrdId');

        $detailSetoranSubquery = DB::table('detail_setoran as ds')
            ->join('setoran as s', 's.nomorNota', '=', 'ds.nomorNota')
            ->where('s.status', 'Approved')
            ->selectRaw('ds.skrdId, SUM(ds.jumlahBayar) as totalDetailSetoran')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween(DB::raw('DATE(ds.tanggalBayar)'), [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where(DB::raw('DATE(ds.tanggalBayar)'), '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where(DB::raw('DATE(ds.tanggalBayar)'), '<=', $endDate))
            ->groupBy('ds.skrdId');

        $query = Skrd::query()
            ->leftJoinSub($pembayaranSubquery, 'p', function ($join) {
                $join->on('skrd.id', '=', 'p.skrdId');
            })
            ->leftJoinSub($detailSetoranSubquery, 'ds', function ($join) {
                $join->on('skrd.id', '=', 'ds.skrdId');
            })
            ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
            ->select([
                DB::raw('MAX(id) as id'),
                'namaKategori',
                'namaSubKategori',
                DB::raw('COUNT(*) as jumlah'),
                DB::raw('SUM(COALESCE(tagihanPerTahunSkrd,0)) as tagihan'),
                DB::raw('SUM(COALESCE(p.totalPembayaran, 0) + COALESCE(ds.totalDetailSetoran, 0)) as total')
                // DB::raw('SUM(
                //     COALESCE(
                //         (SELECT SUM(jumlahBayar) FROM detail_setoran WHERE detail_setoran.skrdId = skrd.id),
                //         (SELECT SUM(jumlahBayar) FROM pembayaran WHERE pembayaran.skrdId = skrd.id),
                //         0
                //     )
                // ) as total')
            ])
            ->groupBy('namaKategori', 'namaSubKategori')
            ->orderBy('namaKategori')
            ->orderBy('namaSubKategori');

        // switch ($getSortBy) {
        //     case 'jumlah':
        //         $query->orderBy('jumlah', $getSortDir);
        //         break;
        //     default:
        //         $query->orderBy($getSortBy, $getSortDir);
        //         break;
        // }

        // $query->orderBy($getSortBy, $getSortDir);

        // switch ($getSortBy) {
        //     case 'jumlah':
        //     case 'tagihan':
        //     case 'namaKategori':
        //     case 'namaSubKategori':
        //     case 'id':
        //         $query->orderBy($getSortBy, $getSortDir);
        //         break;
        //     default:
        //         $query->orderBy('id', 'desc');
        // }

        $rows = $query->get();

        $datas = $rows->groupBy('namaKategori')->values()->map(function ($grp, $i) {
            return [
                'no' => $i + 1,
                'namaKategori' => $grp->first()->namaKategori,
                'subKategori' => $grp->values()->map(fn($r) => [
                    'label' => $r->namaSubKategori,
                    'jumlah' => (int) $r->jumlah,
                    'tagihan' => (int) $r->tagihan,
                    'totalBayar' => (int) $r->total
                ])->all(),
            ];
        });

        // dd($datas);

        return Inertia::render('Super-Admin/Rekapitulasi/Spkrd/Index', [
            'datas' => $datas,
            'filters' => [
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ],
            'role' => Auth::user()->role
        ]);
    }

    public function spkrdDetail(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');
        $kategori = $request->get('kategori');
        $subKategori = $request->get('sub_kategori');

        $getSortBy  = $request->get('sort', 'created_at');
        $getSortDir = $request->get('direction', 'desc');
        // $getPage    = (int) $request->get('per_page', 10);

        abort_unless($kategori && $subKategori, 422, 'Kategori & Sub Kategori wajib.');

        $query = Skrd::with('setoran', 'detailSetoran', 'pembayaran')
            ->when($startDate, fn($q) => $q->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn($q)   => $q->whereDate('created_at', '<=', $endDate))
            ->where('namaKategori', $kategori)
            ->where('namaSubKategori', $subKategori);

        $datas =  $query->orderBy($getSortBy, $getSortDir)->get();
        // $datas = $getPage <= 0
        //     ? $query->orderBy($getSortBy, $getSortDir)->get()
        //     : $query->orderBy($getSortBy, $getSortDir)->paginate($getPage)->withQueryString();

        return Inertia::render('Super-Admin/Rekapitulasi/Spkrd/Detail', [
            'datas' => $datas,
            'filters' => [
                'tanggal_mulai'  => $startDate,
                'tanggal_akhir'  => $endDate,
                'kategori'       => $kategori,
                'sub_kategori'   => $subKategori,
            ],
            'bulan' => $this->getBulan()
        ]);
    }

    public function penerimaan(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        return Inertia::render('Super-Admin/Rekapitulasi/Penerimaan/Index', [
            'datas' => Inertia::defer(function () use ($startDate, $endDate, $rangeCol) {
                return
                    Uptd::with([
                        'skrd' => function ($q) use ($startDate, $endDate, $rangeCol) {
                            if ($startDate || $endDate) {
                                $q->when($startDate && $endDate, fn($data) => $data->whereBetween($rangeCol, [$startDate, $endDate]))
                                    ->when($startDate && !$endDate, fn($data) => $data->where($rangeCol, '>=', $startDate))
                                    ->when(!$startDate && $endDate, fn($data) => $data->where($rangeCol, '<=', $endDate));
                            } else {
                                $q->whereYear($rangeCol, Carbon::now()->year);
                            }
                        },
                        'skrd.pembayaran',
                        'skrd.setoran' => function ($q) {
                            $q->where('status', 'Approved')->where('current_stage', 'bendahara');
                        },
                    'skrd.setoran.detailSetoran' 
                    => fn($q) => $q->whereYear('tanggalBayar', Carbon::now()->year),
                    // ,
                    ])
                    ->where('namaUptd', '!=', 'Dinas')
                    ->get(['id', 'namaUptd'])
                    ->map(function ($u) {
                        return [
                            'namaUptd' => $u->namaUptd,
                            'skrd' => $u->skrd->count(),
                            'tagihanPertahun' => $u->skrd->sum('tagihanPerTahunSkrd'),
                            'totalBayar' => $u->skrd->sum(function ($skrd) {;
                                $totalSetoran = $skrd->setoran->sum(function ($setoran) {
                                    return $setoran->detailSetoran->sum('jumlahBayar');
                                });
                                $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar') ?? 0;

                                return $totalSetoran + $totalPembayaran;
                            })
                        ];
                    })->values();
            }),
            'filters' => [
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ]
        ]);
    }

    public function notaTagihan(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getSortDir = $request->get('direction', 'desc');

        $query = Invoice::query()
            ->select('invoices.*')
            ->join('skrd', 'invoices.noSkrd', '=', 'skrd.noSkrd')
            ->with(['skrd:noSkrd,noWajibRetribusi,namaObjekRetribusi,alamatObjekRetribusi,kelurahanObjekRetribusi,kecamatanObjekRetribusi,tagihanPerBulanSkrd'])
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('invoices.created_at', [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where('invoices.created_at', '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where('invoices.created_at', '<=', $endDate));

        switch ($getSortBy) {
            case 'noWajibRetribusi':
                $query->orderBy('skrd.noWajibRetribusi', $getSortDir);
                break;
            case 'namaObjekRetribusi':
                $query->orderBy('skrd.namaObjekRetribusi', $getSortDir);
                break;
            case 'jumlah_bulan':
            case 'satuan':
            case 'total_retribusi':
            case 'no_invoice':
            case 'id':
            default:
                $query->orderBy($getSortBy, $getSortDir);
                break;
        }

        $skrd = Skrd::select('noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'tagihanPerBulanSkrd')
            ->where('noSkrd', '!=', null)
            ->get()
            ->sortBy(function ($item) {
                $parts = explode('/', $item->noSkrd);

                $nomorAwal = (int) $parts[0];
                $tahun = (int) end($parts);

                return ([$nomorAwal, $tahun]);
            })
            ->values()
            ->map(function ($skrd) {
                return [
                    'value' => $skrd->noSkrd,
                    'label' => $skrd->noSkrd,
                    'namaObjekRetribusi' => $skrd->namaObjekRetribusi,
                    'tagihanPerbulan' => $skrd->tagihanPerBulanSkrd
                ];
            });

        return Inertia::render('Super-Admin/Rekapitulasi/Nota-Tagihan/Index', [
            'datas' => Inertia::defer(fn() => $query->get()),
            'filters' => [
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ],
            'retribusiOptions' => $skrd,
            'role' => auth()->user()->role
        ]);
    }
}
