<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\Uptd;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {

        $year = $request->input('year', now()->year);

        $years = WajibRetribusi::selectRaw('YEAR(created_at) as year')
            ->union(Skrd::selectRaw('YEAR(created_at) as year'))
            ->distinct()
            ->orderBy('year', 'asc')
            ->pluck('year')
            ->map(fn($y) => (int) $y);

        $jumlahWR = WajibRetribusi::whereYear('created_at', $year)->count();
        $jumlahSkrd = Skrd::whereYear('created_at', $year)->count();

        $proyeksiPenerimaan = Skrd::whereYear('created_at', $year)->sum('tagihanPerTahunSkrd');
        $penerimaan = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');
        $belumTertagih = $proyeksiPenerimaan - $penerimaan;

        $penerimaanHariIni = Pembayaran::whereDate('created_at', Carbon::today())->sum('jumlahBayar');
        $penerimaanBulanIni = Pembayaran::whereYear('created_at', $year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('jumlahBayar');
        $penerimaanTahunIni = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');

        // $kategoriPembayaran = Pembayaran::with('uptd.kecamatan')
        //     ->whereYear('tanggalBayar', $year)
        //     ->get()
        //     ->groupBy(fn($p) => $p->uptd->kecamatan->namaKecamatan ?? "tidak diketahui")
        //     ->map(fn($group) => $group->count('jumlahBayar'));
        $kecamatan = Uptd::with('kecamatan')->get();

        $kategoriPembayaran = $kecamatan->mapWithKeys(function ($uptd) {
            return [$uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui" => 0];
        });

        $pembayaranPie = Pembayaran::with('uptd.kecamatan')
            ->whereYear('tanggalBayar', $year)
            ->get()
            ->groupBy(fn($p) => $p->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
            ->map(fn($group) => $group->sum('jumlahBayar'));

        $kategoriPembayaran = $kategoriPembayaran->merge($pembayaranPie);
        $labelsKec = $kategoriPembayaran->keys()->toArray();
        $dataKec = $kategoriPembayaran->values()->toArray();

        $payments = Pembayaran::whereYear('tanggalBayar', $year)
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggalBayar)->month;
            });

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

        return Inertia::render('Super-Admin/Dashboard', [
            'year' => $year,
            'years' => $years,
            'stats' => [
                'jumlahWR' => $jumlahWR,
                'jumlahSkrd' => $jumlahSkrd,
                'proyeksiPenerimaan' => $proyeksiPenerimaan,
                'penerimaan' => $penerimaan,
                'belumTertagih' => $belumTertagih,
                'penerimaanHariIni' => $penerimaanHariIni,
                'penerimaanBulanIni' => $penerimaanBulanIni,
                'penerimaanTahunIni' => $penerimaanTahunIni
            ],
            'chart' => [
                'labels' => $labels,
                'data' => $data
            ],
            'chartKecamatan' => [
                'labels' => $labelsKec,
                'data' => $dataKec
            ]
        ]);
    }
}
