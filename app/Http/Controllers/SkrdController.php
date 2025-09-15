<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\SkrdDataExport;
use App\Exports\SkrdExport;
use App\Models\Skrd;
use App\Models\TandaTangan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;


class SkrdController extends Controller
{
    public function downloadPdf(Request $request)
    {
        $query = Skrd::query()
            ->with(['user:id,namaLengkap,lokasi', 'pembayaran', 'uptd'])
            ->addSelect([
                'skrd.*',
                'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                    ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                    ->whereColumn('skrdId', 'skrd.id')
            ]);

        if ($search = $request->search) {
            $query->where('namaObjekRetribusi', 'like', "%{$search}%");
        }

        if ($kategori = $request->kategori) {
            $query->where('namaKategori', $kategori);
        }

        if ($subKategori = $request->{'sub-kategori'}) {
            $query->where('subKategori', $subKategori);
        }

        if ($petugas = $request->petugas) {
            $query->whereHas('user', fn($q) => $q->where('id', $petugas));
        }

        if ($status = $request->status) {
            if ($status === 'lunas') {
                $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) = 0');
            } elseif ($status === 'belum_lunas') {
                $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) > 0');
            }
        }

        $data = $query->get();

        $pdf = Pdf::loadView('exports.skrd.skrd-pdf', compact('data'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        $fileName = 'laporan-skrd-' . date('Y-m-d-H-i-s') . '.pdf';

        return $pdf->download($fileName);
    }

    public function downloadExcel(Request $request)
    {
        $fileName = 'laporan-skrd-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new SkrdDataExport($request),
            $fileName
        );
    }

    public function downloadSinglePdf($id)
    {
        $data = Skrd::with(['user:id,namaLengkap,lokasi,role', 'pembayaran', 'pemilik'])->findOrFail($id);

        $user = User::firstWhere('role', 'ROLE_KABID');

        $tandaTangan = TandaTangan::first();

        $f4 = [0, 0, 595.276, 935.433];

        $pdf = Pdf::loadView('exports.skrd.skrd-single-pdf', [
            'data' => $data,
            'kabid' => $user,
            'tandaTangan' => $tandaTangan
        ])
            ->setPaper($f4, 'portrait')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'arial',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        return $pdf->stream("SPKRD-{$data->noWajibRetribusi}.pdf");
    }

    public function previewPdfLocal($filename)
    {
        $path = storage_path('app/private/skrd/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    public function downloadSingleExcel($id)
    {
        return Excel::download(new SkrdExport($id), 'skrd-' . $id . '.xlsx');
    }
}
