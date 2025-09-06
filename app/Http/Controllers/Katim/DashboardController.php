<?php

namespace App\Http\Controllers\Katim;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {
        $year = $request->input('year', now()->year);
        return Inertia::render('Katim/Dashboard', [
            'rute' => 'katim.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => $dashboardService->getStats($year),
            'chart' => $dashboardService->getChart($year),
            'chartKecamatan' => $dashboardService->getKecamatanChart($year)
        ]);
    }
}
