<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Skrd;
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

        // $proyeksiPenerimaan = Pembayaran::whereYear('created_at', $year)->pluck('jumlahBayar')->sum();
        $proyeksiPenerimaan = Skrd::whereYear('created_at', $year)->sum('tagihanPerTahunSkrd');
        $penerimaan = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');
        $belumTertagih = $proyeksiPenerimaan - $penerimaan;

        $penerimaanHariIni = Pembayaran::whereDate('created_at', Carbon::today())->sum('jumlahBayar');
        $penerimaanBulanIni = Pembayaran::whereYear('created_at', $year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('jumlahBayar');
        $penerimaanTahunIni = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');
        

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
            ]
        ]);
    }
}
