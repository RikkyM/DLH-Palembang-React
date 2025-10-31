<?php

namespace App\Services;

use App\Models\DetailSetoran;
use App\Models\Kecamatan;
use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\Uptd;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    private function getUptdId()
    {
        return Auth::user()->uptdId;
    }

    public function getLastYear()
    {
        return Skrd::pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->year)
            ->unique()
            ->values()
            ->sort();
    }

    public function getYears()
    {
        return WajibRetribusi::selectRaw('YEAR(created_at) as year')
            ->union(Skrd::selectRaw('Year(created_at) as year'))
            ->distinct()
            ->orderBy('year', 'asc')
            ->pluck('year')
            ->map(fn($y) => (int) $y);
    }

    public function getChart($year)
    {
        $getPayment = Pembayaran::whereYear('tanggalBayar', $year);
        $getDetailSetoran = DetailSetoran::with('setoran', 'skrd')
            ->whereHas('setoran', fn($q) => $q->where('status', 'Approved')->where('current_stage', 'bendahara'));

        if (in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT'])) {
            $getPayment->where('uptdId', $this->getUptdId());
            $getDetailSetoran->whereRelation('skrd', 'uptdId', $this->getUptdId());
        }

        $payments = (clone $getPayment)
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->tanggalBayar)->month);

        $detailSetoran = (clone $getDetailSetoran)
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->tanggalBayar)->month);

        $bayaranPerbulan = [];
        for ($i = 1; $i <= 12; $i++) {
            $totalPembayaran = $payments->has($i) ? $payments[$i]->sum('jumlahBayar') : 0;
            $totalDetailSetoran = $detailSetoran->has($i) ? $detailSetoran[$i]->sum('jumlahBayar') : 0;

            $bayaranPerbulan[$i] = $totalPembayaran + $totalDetailSetoran;
        }

        $labels = [];
        $data = [];
        foreach (range(1, 12) as $i) {
            $labels[] = Carbon::create()->month($i)->locale('id')->monthName;
            $data[] = $bayaranPerbulan[$i];
        }

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }

    public function getStats($year)
    {
        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $countWR = WajibRetribusi::whereYear('created_at', $year);
        $countSkrd = Skrd::whereYear('created_at', $year);

        $perKecamatan = Kecamatan::with([
            'uptd.skrd' =>
            fn($query) => $query->whereYear($rangeCol, $year)
                ->when(
                    in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT']),
                    fn($q) => $q->where('uptdId', $this->getUptdId())
                ),
            'uptd.skrd.pembayaran',
            'uptd.skrd.setoran' => fn($q) => $q->where('status', 'Approved')->where('current_stage', 'bendahara'),
            'uptd.skrd.setoran.detailSetoran'
        ])
            ->get()
            ->sum(fn($kec) => $kec->uptd->skrd->sum(function ($s) {
                $totalSetoran = $s->setoran->sum(fn($s) => $s->detailSetoran->sum('jumlahBayar'));
                $totalPembayaran = $s->pembayaran->sum('jumlahBayar') ?? 0;
                return $totalSetoran + $totalPembayaran;
            }));

        $perUptd = Uptd::with(
            [
                'skrd' => fn($q) => $q->whereYear($rangeCol, $year)
                    ->when(
                        in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT']),
                        fn($q) => $q->where('uptdId', $this->getUptdId())
                    ),
                'skrd.pembayaran',
                'skrd.setoran' => fn($q) => $q->where('status', 'Approved')->where('current_stage', 'bendahara'),
                'skrd.setoran.detailSetoran'
            ]
        )
            ->get()
            ->sum(fn($u) => $u->skrd->sum(function ($s) {
                $totalSetoran = $s->setoran->sum(fn($s) => $s->detailSetoran->sum('jumlahBayar') ?? 0);
                $totalPembayaran = $s->pembayaran->sum('jumlahBayar') ?? 0;
                return $totalSetoran + $totalPembayaran;
            }));

        $countProyeksi = Skrd::whereYear($rangeCol, $year);
        $getPembayaran = Pembayaran::whereYear('created_at', $year);
        $getDetailSetoran = DetailSetoran::with('setoran', 'skrd')
            ->whereRelation('setoran', 'status', 'Approved')
            ->whereRelation('setoran', 'current_stage', 'bendahara')
            ->whereYear('tanggalBayar', $year);

        if (in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT'])) {
            $countWR->where('uptdId', $this->getUptdId());
            $countSkrd->where('uptdId', $this->getUptdId());
            $countProyeksi->where('uptdId', $this->getUptdId());
            $getPembayaran->where('uptdId', $this->getUptdId());
            $getDetailSetoran->whereRelation('skrd', 'uptdId', $this->getUptdId());
        }

        $jumlahWR = $countWR->count();
        $jumlahSkrd = $countSkrd->count();
        $proyeksiPenerimaan = $countProyeksi->sum('tagihanPerTahunSkrd');

        $penerimaanPembayaran = (clone $getPembayaran)->sum('jumlahBayar');
        $penerimaanDetailSetoran = (clone $getDetailSetoran)->sum('jumlahBayar');

        // dd($penerimaanDetailSetoran);

        $penerimaan = $penerimaanPembayaran ?: $penerimaanDetailSetoran;
        $belumTertagih = $proyeksiPenerimaan - $penerimaan;

        return [
            'jumlahWR' => $jumlahWR,
            'jumlahSkrd' => $jumlahSkrd,
            'proyeksiPenerimaan' => $proyeksiPenerimaan,
            'penerimaan' => $penerimaan,
            'perKecamatan' => $perKecamatan,
            'perUptd' => $perUptd,
            'belumTertagih' => $belumTertagih,
            'penerimaanHariIni' => (clone $getPembayaran)
                ->whereDate('created_at', Carbon::today())
                ->sum('jumlahBayar') ?: (clone $getDetailSetoran)
                ->whereDate('created_at', Carbon::today())->sum('jumlahBayar'),
            'penerimaanBulanIni' => (clone $getPembayaran)
                ->whereMonth('created_at', Carbon::now()->month)
                ->sum('jumlahBayar') ?: (clone $getDetailSetoran)
                ->whereMonth('created_at', Carbon::now()->month)
                ->sum('jumlahBayar'),
            'penerimaanTahunIni' => (clone $getPembayaran)->sum('jumlahBayar') ?: (clone $getDetailSetoran)->sum('jumlahBayar'),
        ];
    }

    // public function getKecamatanChart($year)
    // {
    //     $getKecamatan = Uptd::with('kecamatan');
    //     $getPembayaran = Pembayaran::with('uptd.kecamatan')
    //         ->whereYear('tanggalBayar', $year);
    //     $getDetailSetoran = DetailSetoran::with(['setoran', 'skrd', 'skrd.uptd.kecamatan'])
    //         ->whereRelation('setoran', 'status', 'Approved')->whereRelation('setoran', 'current_stage', 'bendahara')
    //         ->whereYear('tanggalBayar', $year);

    //     // dd(Skrd::where('uptdId', 9)->whereYear('created_at', 2025)->count());
    //     // dd($getDetailSetoran->count());

    //     if (in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT'])) {
    //         $getKecamatan->where('id', $this->getUptdId());
    //         $getPembayaran->where('uptdId', $this->getUptdId());
    //     }

    //     $kecamatan = $getKecamatan->get();

    //     $kategoriPembayaran = $kecamatan->mapWithKeys(fn($uptd) => [
    //         $uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui" => 0
    //     ]);

    //     $pembayaranPie = (clone $getPembayaran)
    //         ->get()
    //         ->groupBy(fn($p) => $p->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
    //         ->map(fn($group) => $group->sum('jumlahBayar'));

    //     if ($pembayaranPie->isEmpty()) {
    //         $pembayaranPie =
    //             $getDetailSetoran->get()
    //             ->groupBy(fn($item) => $item->skrd->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
    //             ->map(fn($item) => $item->sum('jumlahBayar'));
    //     }

    //     // dd($pembayaranPie);

    //     $kategoriPembayaran = $kategoriPembayaran->merge($pembayaranPie);

    //     return [
    //         'labels' => $kategoriPembayaran->keys()->toArray(),
    //         'data' => $kategoriPembayaran->values()->toArray(),
    //     ];
    // }

    public function getKecamatanChart($year)
    {
        $kecamatan = Uptd::with('kecamatan')->get();

        $kategoriPembayaran = $kecamatan->mapWithKeys(fn($uptd) => [
            $uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui" => 0
        ]);

        $pembayaranPie = Pembayaran::with('uptd.kecamatan')
            ->whereYear('tanggalBayar', $year)
            ->get()
            ->groupBy(fn($p) => $p->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
            ->map(fn($group) => $group->sum('jumlahBayar'));

        if ($pembayaranPie->isEmpty()) {
            $pembayaranPie = DetailSetoran::with(['setoran', 'skrd', 'skrd.uptd.kecamatan'])
                ->whereRelation('setoran', 'status', 'Approved')
                ->whereRelation('setoran', 'current_stage', 'bendahara')
                ->whereYear('tanggalBayar', $year)
                ->get()
                ->groupBy(fn($item) => $item->skrd->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
                ->map(fn($item) => $item->sum('jumlahBayar'));
        }


        $kategoriPembayaran = $kategoriPembayaran->merge($pembayaranPie);

        return [
            'labels' => $kategoriPembayaran->keys()->toArray(),
            'data' => $kategoriPembayaran->values()->toArray(),
        ];
    }
}
