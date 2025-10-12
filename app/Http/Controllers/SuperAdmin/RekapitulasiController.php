<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Skrd;
use App\Models\Uptd;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

        $query = Skrd::query()
            ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
            ->select([
                DB::raw('MAX(id) as id'),
                'namaKategori',
                'namaSubKategori',
                DB::raw('COUNT(*) as jumlah')
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

        $query->orderBy($getSortBy, $getSortDir);

        $datas = $query->get()->groupBy('namaKategori')->values()->map(function ($grp, $i) {
            return [
                'no' => $i + 1,
                'namaKategori' => $grp->first()->namaKategori,
                'subKategori' => $grp->values()->map(fn($r) => [
                    'label' => $r->namaSubKategori,
                    'jumlah' => (int) $r->jumlah
                ])->all()
            ];
        });

        return Inertia::render('Super-Admin/Rekapitulasi/Spkrd/Index', [
            'datas' => $datas,
            'filters' => [
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ],
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
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'desc');
        $getPage = $request->get('per_page', 10);

        $filter = function ($query, $tanggal = 'tanggalBayar') use ($startDate, $endDate) {
            $query->when($startDate && $endDate, fn($q) => $q->whereBetween($tanggal, [$startDate, $endDate]))
                ->when($startDate && !$endDate, fn($q) => $q->where($tanggal, '>=', $startDate))
                ->when(!$startDate && $endDate, fn($q) => $q->where($tanggal, '<=', $endDate));
        };

        $setoranFilter = function ($query) use ($filter) {
            $query->where('status', 'Approved')
                ->where('current_stage', 'bendahara');
            $filter($query, 'tanggal_diterima');
        };

        // $query = Skrd::with([
        //     'pembayaran' => $filter,
        //     // function ($q) use ($startDate, $endDate) {
        //     //     $q->when($startDate && $endDate, fn($query) => $query->whereBetween('tanggalBayar', [$startDate, $endDate]))
        //     //         ->when($startDate && !$endDate, fn($query) => $query->where('tanggalBayar', '>=', $startDate))
        //     //         ->when(!$startDate && $endDate, fn($query) => $query->where('tanggalBayar', '<=', $endDate));
        //     // },
        //     'setoran' => $setoranFilter,
        //     // function ($q) use ($startDate, $endDate) {
        //     //     $q->where('status', 'Approved')
        //     //         ->where('current_stage', 'bendahara')
        //     //         ->when($startDate && $endDate, fn($query) => $query->whereBetween('tanggal_diterima', [$startDate, $endDate]))
        //     //         ->when($startDate && !$endDate, fn($query) => $query->where('tanggal_diterima', '>=', $startDate))
        //     //         ->when(!$startDate && $endDate, fn($query) => $query->where('tanggal_diterima', '<=', $endDate));
        //     // },
        //     'detailSetoran',
        //     'uptd:id,namaUptd'
        // ])
        //     ->whereHas('pembayaran', function ($q) use ($startDate, $endDate) {
        //         $q->when($startDate && $endDate, fn($query) => $query->whereBetween('tanggalBayar', [$startDate, $endDate]))
        //             ->when($startDate && !$endDate, fn($query) => $query->where('tanggalBayar', '>=', $startDate))
        //             ->when(!$startDate && $endDate, fn($query) => $query->where('tanggalBayar', '<=', $endDate));
        //     })
        //     ->orWhereHas('setoran', function ($q) use ($startDate, $endDate) {
        //         $q->where('status', 'Approved')
        //             ->where('current_stage', 'bendahara')
        //             ->when($startDate && $endDate, fn($query) => $query->whereBetween('tanggal_diterima', [$startDate, $endDate]))
        //             ->when($startDate && !$endDate, fn($query) => $query->where('tanggal_diterima', '>=', $startDate))
        //             ->when(!$startDate && $endDate, fn($query) => $query->where('tanggal_diterima', '<=', $endDate));
        //     })
        //     // with('pembayaran', 'setoran', 'detailSetoran', 'uptd:id,namaUptd')
        //     // ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
        //     // ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
        //     // ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
        //     ->get()
        //     ->groupBy('uptd.namaUptd')
        //     ->map(fn($group, $namaUptd) => [
        //         'namaUptd' => $namaUptd,
        //         'tagihanPertahun' => $group->sum('tagihanPerTahunSkrd'),
        //         'totalBayar' => $group->sum(function ($skrd) {
        //             $totalSetoran = $skrd->setoran->where('status', 'Approved')->where('current_stage', 'bendahara')->sum('jumlahBayar');
        //             $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

        //             return $totalSetoran + $totalPembayaran;
        //         }),
        //     ])->values();

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $query = Uptd::with([
            'skrd' => function ($q) use ($startDate, $endDate, $rangeCol) {
                $q->when($startDate && $endDate, fn($data) => $data->whereBetween($rangeCol, [$startDate, $endDate]))
                    ->when($startDate && !$endDate, fn($data) => $data->where($rangeCol, '>=', $startDate))
                    ->when(!$startDate && $endDate, fn($data) => $data->where($rangeCol, '<=', $endDate));
            },
            'skrd.pembayaran',
            'skrd.setoran',
            // 'skrd.pembayaran' => $filter,
            // 'skrd.setoran' => $setoranFilter,
            'skrd.detailSetoran'
        ])
            ->where('namaUptd', '!=', 'Dinas')
            // ->whereHas('skrd.pembayaran', $filter)
            // ->whereHas('skrd.setoran', $setoranFilter)
            ->get(['id', 'namaUptd'])
            ->map(function ($u) use ($startDate, $endDate, $rangeCol) {

                return [
                    'namaUptd' => $u->namaUptd,
                    'tagihanPertahun' => $u->skrd->sum('tagihanPerTahunSkrd'),
                    'totalBayar' => $u->skrd->sum(function ($skrd) {
                        $totalSetoran = $skrd->setoran->where('status', 'Approved')->where('current_stage', 'bendahara')->sum('jumlahBayar');
                        $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

                        return $totalSetoran + $totalPembayaran;
                    })
                    // 'tagihanPertahun' => $u->skrd->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
                    // $u->skrd->where(function ($q) use ($startDate, $endDate, $rangeCol) {
                    // $q->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
                    //     ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
                    //     ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
                    // $q->sum('tagihanPerTahunSkrd');
                    // }) ?? 0
                ];
            })->values();

        // ->groupBy('namaUptd');
        // ->map(fn($group, $namaUptd) => [
        //     'namaUptd' => $namaUptd,
        //     'tagihanPertahun' => $group->sum('tagihanPerTahunSkrd'),
        //     'totalBayar' => $group->sum(function ($skrd) {
        //         $totalSetoran = $skrd->setoran->where('status', 'Approved')->where('current_stage', 'bendahara')->sum('jumlahBayar');
        //         $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

        //         return $totalSetoran + $totalPembayaran;
        //     }),
        // ])->values();

        // dd($query);

        return Inertia::render('Super-Admin/Rekapitulasi/Penerimaan/Index', [
            'datas' => $query,
            'filters' => [
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                'per_page' => (int) $getPage,
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ]
        ]);
    }
}
