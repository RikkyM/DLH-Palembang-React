<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\WajibRetribusi;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {

        $lastYear = $dashboardService->getLastYear();

        $getKecamatan = $request->get('kecamatan');

        $year = $request->input('year', $lastYear[count($lastYear) - 1]);

        $kecamatan = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
            ->get()
            ->map(fn($kec) => [
                'value' => $kec->namaKecamatan,
                'label' => $kec->namaKecamatan,
            ])->values();

        $retribusi = WajibRetribusi::with('kecamatan', 'kelurahan')->select('kodeKecamatan', 'kodeKelurahan', 'latitude', 'longitude')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->when($getKecamatan, function ($query) use ($getKecamatan) {
                return $query->whereRelation('kecamatan', 'namaKecamatan', $getKecamatan);
            });

        return Inertia::render('Super-Admin/Dashboard', [
            'rute' => 'super-admin.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => Inertia::defer(fn() => $dashboardService->getStats($year)),
            'chart' => Inertia::defer(fn() => $dashboardService->getChart($year)),
            'chartKecamatan' => Inertia::defer(fn() => $dashboardService->getKecamatanChart($year)),
            'locations' => Inertia::defer(fn() => $retribusi->get()),
            'kecamatanOptions' => $kecamatan,
            'filters' => [
                'kecamatan' => $getKecamatan
            ]
        ]);
    }
}
