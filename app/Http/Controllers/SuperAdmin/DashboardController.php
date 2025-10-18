<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Skrd;
use App\Models\Uptd;
use App\Models\User;
use App\Models\WajibRetribusi;
use App\Services\DashboardService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService)
    {

        $lastYear = $dashboardService->getLastYear();

        $year = $request->input('year', $lastYear[count($lastYear) - 1]);

        return Inertia::render('Super-Admin/Dashboard', [
            'rute' => 'super-admin.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => Inertia::defer(fn() => $dashboardService->getStats($year)),
            'chart' => Inertia::defer(fn() => $dashboardService->getChart($year)),
            'chartKecamatan' => Inertia::defer(fn() => $dashboardService->getKecamatanChart($year))
        ]);
    }
}
