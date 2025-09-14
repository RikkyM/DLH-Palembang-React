<?php

namespace App\Services;

use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\Uptd;
use App\Models\WajibRetribusi;
use Carbon\Carbon;

class DashboardService
{
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
        $payments = Pembayaran::whereYear('tanggalBayar', $year)
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->tanggalBayar)->month);

        $bayaranPerbulan = [];
        for ($i = 1; $i <= 12; $i++) {
            $bayaranPerbulan[$i] = $payments->has($i) ? $payments[$i]->sum('jumlahBayar') : 0;
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
        $jumlahWR = WajibRetribusi::whereYear('created_at', $year)->count();
        $jumlahSkrd = Skrd::whereYear('created_at', $year)->count();

        $proyeksiPenerimaan = Skrd::whereYear('created_at', $year)->sum('tagihanPerTahunSkrd');
        $penerimaan = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');
        $belumTertagih = $proyeksiPenerimaan - $penerimaan;

        return [
            'jumlahWR' => $jumlahWR,
            'jumlahSkrd' => $jumlahSkrd,
            'proyeksiPenerimaan' => $proyeksiPenerimaan,
            'penerimaan' => $penerimaan,
            'belumTertagih' => $belumTertagih,
            'penerimaanHariIni' => Pembayaran::whereYear('created_at', $year)
                ->whereDate('created_at', Carbon::today())->sum('jumlahBayar'),
            'penerimaanBulanIni' => Pembayaran::whereYear('created_at', $year)
                ->whereMonth('created_at', Carbon::now()->month)
                ->sum('jumlahBayar'),
            'penerimaanTahunIni' => Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar'),
        ];
    }

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

        $kategoriPembayaran = $kategoriPembayaran->merge($pembayaranPie);

        return [
            'labels' => $kategoriPembayaran->keys()->toArray(),
            'data' => $kategoriPembayaran->values()->toArray(),
        ];
    }
}
