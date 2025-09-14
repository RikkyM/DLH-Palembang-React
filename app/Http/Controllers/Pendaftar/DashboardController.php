<?php

namespace App\Http\Controllers\Pendaftar;

use App\Http\Controllers\Controller;
use App\Models\Skrd;
use App\Models\WajibRetribusi;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {
        $year = $request->input('year', now()->year());
        
        return Inertia::render('Pendaftar/Dashboard', [
            'rute' => 'pendaftar.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => $dashboardService->getStats($year),
            'chart' => $dashboardService->getChart($year),
            'chartKecamatan' => $dashboardService->getKecamatanChart($year)
        ]);
    }
}
