<?php

namespace App\Http\Controllers;

use App\Exports\RekapRetribusiExport;
use App\Exports\RekapSpkrdExport;
use App\Models\Invoice;
use App\Models\Skrd;
use App\Models\Uptd;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RekapitulasiController extends Controller
{
    private function getBulan()
    {
        Carbon::setLocale('id');

        return collect(range(1, 12))
            ->map(fn($i) => strtoupper(Carbon::create()->month($i)->translatedFormat('F')));
    }

    private function getRole()
    {
        $role = Auth::user()->role;

        return match ($role) {
            'ROLE_SUPERADMIN'       => 'Super-Admin',
            'ROLE_PENDAFTAR'        => 'Pendaftar',
            'ROLE_KUPTD'            => 'Kuptd',
            'ROLE_KATIM'            => 'Katim',
            'ROLE_KABID'            => 'Kabid',
            'ROLE_KASUBAG_TU_UPDT'  => 'Kasubag',
            'ROLE_BENDAHARA'        => 'Bendahara',
            default                 => null
        };
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
            ])
            ->groupBy('namaKategori', 'namaSubKategori')
            ->orderBy('namaKategori')
            ->orderBy('namaSubKategori');

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

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Spkrd/Index", [
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

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $query = Skrd::with('setoran', 'detailSetoran', 'pembayaran')
            ->when($startDate, fn($q) => $q->whereDate($rangeCol, '>=', $startDate))
            ->when($endDate, fn($q)   => $q->whereDate($rangeCol, '<=', $endDate))
            ->where('namaKategori', $kategori)
            ->where('namaSubKategori', $subKategori);

        $datas =  $query->orderBy($getSortBy, $getSortDir)->get();

        // $datas = $getPage <= 0
        //     ? $query->orderBy($getSortBy, $getSortDir)->get()
        //     : $query->orderBy($getSortBy, $getSortDir)->paginate($getPage)->withQueryString();

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Spkrd/Detail", [
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

    public function retribusiKecamatan(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Retribusi-Kecamatan/Index", [
            'datas' => Inertia::defer(fn() => collect()),
            'filters' => [
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ],
            'role' => Auth::user()->role,
        ]);
    }

    public function penerimaan(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $datas =
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

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Penerimaan/Index", [
            'datas' => Inertia::defer(fn() => $datas),
            'filters' => [
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate
            ],
            'role' => Auth::user()->role,
        ]);
    }

    public function penerimaanDetail(Request $request)
    {
        $startDate = $request->get('tanggal_mulai');
        $endDate = $request->get('tanggal_akhir');
        $uptd = $request->get('uptd');

        $getSortBy = $request->get('sort', 'created_at');
        $getSortDir = $request->get('direction', 'desc');

        // abort_unless($uptd, 422, 'UPTD wajib diisi.');

        $rangeCol = DB::raw('DATE(COALESCE(tanggalSkrd, created_at))');

        $datas =
            Skrd::with('setoran', 'uptd', 'detailSetoran', 'pembayaran')
            ->when(
                $startDate || $endDate,
                function ($q) use ($startDate, $endDate, $rangeCol) {
                    if ($startDate && $endDate) {
                        [$from, $to] = $startDate <= $endDate ? [$startDate, $endDate] : [$endDate, $startDate];
                        $q->whereBetween($rangeCol, [$from, $to]);
                    } elseif ($startDate) {
                        $q->where($rangeCol, '>=', $startDate);
                    } else {
                        $q->where($rangeCol, '<=', $endDate);
                    }
                },
                function ($q) use ($rangeCol) {
                    $q->whereBetween($rangeCol, [
                        Carbon::now()->startOfYear()->toDateString(),
                        Carbon::now()->endOfYear()->toDateString(),
                    ]);
                }
            )

            ->whereRelation('uptd', 'namaUptd', $uptd)
            ->orderBy($getSortBy, $getSortDir)
            ->get();

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Penerimaan/Detail", [
            'datas' => Inertia::defer(fn() => $datas),
            'filters' => [
                'tanggal_mulai' => $startDate,
                'tanggal_akhir' => $endDate,
                'uptd' => $uptd,
            ],
            'bulan' => $this->getBulan()
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

        return Inertia::render("{$this->getRole()}/Rekapitulasi/Nota-Tagihan/Index", [
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

    public function exportSpkrd(Request $request)
    {
        $filename = "Rekap-SPKRD-" . date('d-m-Y_H:i:s') . '.xlsx';

        return Excel::download(
            new RekapSpkrdExport($request),
            $filename
        );
    }

    public function exportRetribusi(Request $request)
    {
        $filename =  "Rekap-Retribusi-" . Date('d-m-Y_H:i:s') . ".xlsx";

        return Excel::download(
            new RekapRetribusiExport($request),
            $filename
        );
    }
}
