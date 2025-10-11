<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Skrd;
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
        // $getPage = $request->get('per_page', 10);

        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $query = Skrd::query()
            ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
            // ->when($startDate, fn($q) => $q->whereDate('tanggalSkrd', '>=', $startDate))
            // ->when($endDate, fn($q) => $q->whereDate('tanggalSkrd', '<=', $endDate))
            ->select([
                DB::raw('MAX(id) as id'),
                'namaKategori',
                'namaSubKategori',
                DB::raw('COUNT(*) as jumlah')
            ])
            ->groupBy('namaKategori', 'namaSubKategori');


        switch ($getSortBy) {
            case 'jumlah':
                $query->orderBy('jumlah', $getSortDir);
                break;
            default:
                $query->orderBy($getSortBy, $getSortDir);
                break;
        }

        $datas = $query->get();

        return Inertia::render('Super-Admin/Rekapitulasi/Spkrd/Index', [
            'datas' => $datas,
            'filters' => [
                'sort' => $getSortBy,
                'direction' => $getSortDir,
                // 'per_page' => (int) $getPage,
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
        $getPage    = (int) $request->get('per_page', 10);

        abort_unless($kategori && $subKategori, 422, 'Kategori & Sub Kategori wajib.');

        $query = Skrd::with('setoran', 'detailSetoran', 'pembayaran')
            ->when($startDate, fn($q) => $q->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn($q)   => $q->whereDate('created_at', '<=', $endDate))
            ->where('namaKategori', $kategori)
            ->where('namaSubKategori', $subKategori);

        $datas = $getPage <= 0
            ? $query->orderBy($getSortBy, $getSortDir)->get()
            : $query->orderBy($getSortBy, $getSortDir)->paginate($getPage)->withQueryString();

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

        $rangeCol = DB::raw('DATE(COALESCE(tanggalSkrd, created_at))');

        $query = Skrd::with('pembayaran', 'setoran', 'detailSetoran', 'uptd:id,namaUptd')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
            ->get()
            ->groupBy('uptd.namaUptd')
            ->map(fn($group, $namaUptd) => [
                'namaUptd' => $namaUptd,
                'tagihanPertahun' => $group->sum('tagihanPerTahunSkrd'),
                'totalBayar' => $group->sum(function ($skrd) {
                    $totalSetoran = $skrd->setoran->where('status', 'Approved')->where('current_stage', 'bendahara')->sum('jumlahBayar');
                    $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

                    return $totalSetoran + $totalPembayaran;
                }),
            ])->values();

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
