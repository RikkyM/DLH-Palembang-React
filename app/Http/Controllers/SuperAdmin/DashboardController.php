<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\Skrd;
use App\Models\WajibRetribusi;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {

        $lastYear = $dashboardService->getLastYear();

        $getKecamatan = $request->get('kecamatan');

        $year = $request->input('year', $lastYear[count($lastYear) - 1]);
        $tahun = $request->get('tahun', (string) $lastYear[count($lastYear) - 1]);

        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
            ->get()
            ->map(fn($kec) => [
                'value' => $kec->namaKecamatan,
                'label' => $kec->namaKecamatan,
            ])->values();

        $rangeCol = DB::raw('DATE(COALESCE(tanggalSkrd, created_at))');

        $retribusi = WajibRetribusi::with('kecamatan', 'kelurahan')->select('noSkrd', 'namaObjekRetribusi', 'kodeKecamatan', 'kodeKelurahan', 'latitude', 'longitude', 'created_at')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereYear($rangeCol, $tahun)
            ->when($getKecamatan, function ($query) use ($getKecamatan) {
                return $query->whereRelation('kecamatan', 'namaKecamatan', $getKecamatan);
            });

        $yearsOptions = WajibRetribusi::selectRaw('YEAR(created_at) as year')
            ->union(Skrd::selectRaw('YEAR(created_at) as year'))
            ->distinct()
            ->orderBy('year', 'asc')
            ->pluck('year')
            ->map(fn($y) => [
                'label' => (string) $y,
                'value' => (string) $y
            ]);

        return Inertia::render('Super-Admin/Dashboard', [
            'rute' => 'super-admin.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => Inertia::defer(fn() => $dashboardService->getStats($year)),
            'chart' => Inertia::defer(fn() => $dashboardService->getChart($year)),
            'chartKecamatan' => Inertia::defer(fn() => $dashboardService->getKecamatanChart($year)),
            'locations' => Inertia::defer(fn() => $retribusi->get()),
            'kecamatanOptions' => $kecamatan,
            'yearOptions' => $yearsOptions,
            'filters' => [
                'kecamatan' => $getKecamatan,
                'tahun' => $tahun
            ]
        ]);
    }
}
