<?php

namespace App\Http\Controllers\Kasubag;

use App\Http\Controllers\Controller;
use App\Models\WajibRetribusi;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {
        $lastYear = $dashboardService->getLastYear();

        $getKecamatan = $request->get('kecamatan', Auth::user()->uptd->kecamatan->namaKecamatan);

        $retribusi = WajibRetribusi::with('kecamatan', 'kelurahan')->select('kodeKecamatan', 'kodeKelurahan', 'latitude', 'longitude')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->when($getKecamatan, function ($query) use ($getKecamatan) {
                return $query->whereRelation('kecamatan', 'namaKecamatan', $getKecamatan);
            });

        $year = $request->input('year', $lastYear[count($lastYear) - 1]);
        return Inertia::render('Kasubag/Dashboard', [
            'rute' => 'kasubag.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => Inertia::defer(fn() => $dashboardService->getStats($year)),
            'chart' => Inertia::defer(fn() => $dashboardService->getChart($year)),
            'chartKecamatan' => Inertia::defer(fn() => $dashboardService->getKecamatanChart($year)),
            'locations' => Inertia::defer(fn() => $retribusi->get()),
        ]);
    }
}
