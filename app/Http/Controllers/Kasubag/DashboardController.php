<?php

namespace App\Http\Controllers\Kasubag;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {
        $lastYear = $dashboardService->getLastYear();
        $year = $request->input('year', $lastYear[count($lastYear) - 1]);
        return Inertia::render('Kasubag/Dashboard', [
            'rute' => 'kasubag.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => $dashboardService->getStats($year),
            'chart' => $dashboardService->getChart($year),
            'chartKecamatan' => $dashboardService->getKecamatanChart($year)
        ]);
    }
}
