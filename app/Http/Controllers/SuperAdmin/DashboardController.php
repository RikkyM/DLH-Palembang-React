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
        // $years = WajibRetribusi::selectRaw('YEAR(created_at) as year')
        //     ->union(Skrd::selectRaw('YEAR(created_at) as year'))
        //     ->distinct()
        //     ->orderBy('year', 'asc')
        //     ->pluck('year')
        //     ->map(fn($y) => (int) $y);

        // $jumlahWR = WajibRetribusi::whereYear('created_at', $year)->count();
        // $jumlahSkrd = Skrd::whereYear('created_at', $year)->count();

        // $proyeksiPenerimaan = Skrd::whereYear('created_at', $year)->sum('tagihanPerTahunSkrd');
        // $penerimaan = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');
        // $belumTertagih = $proyeksiPenerimaan - $penerimaan;

        // $penerimaanHariIni = Pembayaran::whereDate('created_at', Carbon::today())->sum('jumlahBayar');
        // $penerimaanBulanIni = Pembayaran::whereYear('created_at', $year)
        //     ->whereMonth('created_at', Carbon::now()->month)
        //     ->sum('jumlahBayar');
        // $penerimaanTahunIni = Pembayaran::whereYear('created_at', $year)->sum('jumlahBayar');

        // $kecamatan = Uptd::with('kecamatan')->get();

        // $kategoriPembayaran = $kecamatan->mapWithKeys(function ($uptd) {
        //     return [$uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui" => 0];
        // });

        // $pembayaranPie = Pembayaran::with('uptd.kecamatan')
        //     ->whereYear('tanggalBayar', $year)
        //     ->get()
        //     ->groupBy(fn($p) => $p->uptd->kecamatan->namaKecamatan ?? "Tidak Diketahui")
        //     ->map(fn($group) => $group->sum('jumlahBayar'));

        // $kategoriPembayaran = $kategoriPembayaran->merge($pembayaranPie);
        // $labelsKec = $kategoriPembayaran->keys()->toArray();
        // $dataKec = $kategoriPembayaran->values()->toArray();

        // $payments = Pembayaran::whereYear('tanggalBayar', $year)
        //     ->get()
        //     ->groupBy(function ($item) {
        //         return Carbon::parse($item->tanggalBayar)->month;
        //     });

        // $bayaranPerbulan = [];
        // for ($i = 1; $i <= 12; $i++) {
        //     $bayaranPerbulan[$i] = $payments->has($i) ? $payments[$i]->sum('jumlahBayar') : 0;
        // }

        // $labels = [];
        // $data = [];

        // foreach (range(1, 12) as $i) {
        //     $labels[] = Carbon::create()->month($i)->locale('id')->monthName;
        //     $data[] = $bayaranPerbulan[$i];
        // }

        $lastYear = $dashboardService->getLastYear();

        $year = $request->input('year', $lastYear[count($lastYear) - 1]);

        return Inertia::render('Super-Admin/Dashboard', [
            'rute' => 'super-admin.dashboard',
            'year' => $year,
            'years' => $dashboardService->getYears(),
            'stats' => $dashboardService->getStats($year),
            'chart' => $dashboardService->getChart($year),
            'chartKecamatan' => $dashboardService->getKecamatanChart($year)
            // 'stats' => [
            //     'jumlahWR' => $jumlahWR,
            //     'jumlahSkrd' => $jumlahSkrd,
            //     'proyeksiPenerimaan' => $proyeksiPenerimaan,
            //     'penerimaan' => $penerimaan,
            //     'belumTertagih' => $belumTertagih,
            //     'penerimaanHariIni' => $penerimaanHariIni,
            //     'penerimaanBulanIni' => $penerimaanBulanIni,
            //     'penerimaanTahunIni' => $penerimaanTahunIni
            // ],
            // 'chart' => [
            //     'labels' => $labels,
            //     'data' => $data
            // ],
            // 'chartKecamatan' => [
            //     'labels' => $labelsKec,
            //     'data' => $dataKec
            // ]
        ]);
    }

    public function exportUserCSV()
    {
        $fileName = 'usernames.csv';
        $users = User::select(['namaLengkap', 'username'])->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($users) {
            $handle = fopen('php://output', 'w');

            // header kolom
            fputcsv($handle, ['nama lengkap', 'username']);

            // isi data
            foreach ($users as $user) {
                fputcsv($handle, [$user->namaLengkap, $user->username]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportUserPdf()
    {
        $users = User::select(['namaLengkap', 'username', 'jabatan'])->where('namaLengkap', '!=', 'Superadmin')->orderBy('jabatan', 'asc')->get();
        // dd($users);

        $pdf = Pdf::loadView('exports.user', compact('users'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('user.pdf');
    }
}
