<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\WajibRetribusiExport;
use App\Models\Skrd;
use App\Models\TandaTangan;
use App\Models\User;
use App\Models\WajibRetribusi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class WajibRetribusiController extends Controller
{
    public function downloadPdf(Request $request)
    {
        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ]);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($q2) => $q2->where('namaLengkap', 'like', "%{$search}%"))
                    ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($kategori = $request->kategori) {
            $query->whereHas('kategori', fn($q) => $q->where('kodeKategori', $kategori));
        }

        if ($subKategori = $request->{'sub-kategori'}) {
            $query->whereHas('subKategori', fn($q) => $q->where('kodeSubKategori', $subKategori));
        }

        if ($kecamatan = $request->kecamatan) {
            $query->whereHas('kecamatan', fn($q) => $q->where('kodeKecamatan', $kecamatan));
        }

        if ($kelurahan = $request->kelurahan) {
            $query->whereHas('kelurahan', fn($q) => $q->where('kodeKelurahan', $kelurahan));
        }

        if ($petugas = $request->petugas) {
            $query->whereHas(
                'user',
                fn($q) => $q->where('id', $petugas)
            );
        }

        if ($tahun = $request->tahun) {
            $query->whereYear('created_at', $tahun);
        }

        // if ($status = $request->get('status')) {
        //     // $query->where('status', $status);
        //     if (Auth::user()->role === "ROLE_KUPTD") {
        //         $query->where(function ($data) {
        //             $data->where('status', "Processed")
        //                 ->where('current_role', Auth::user()->role);
        //         })->orWhere(function($data) {
        //             $data->whereNull('current_role');
        //         });
        //         // $query->where(function ($data) {
        //         //     $data->where('status', "Processed")
        //         //         ->where('current_role', "ROLE_KUPTD");
        //         // });
        //     }
        // }
        if ($status = $request->get('status')) {
            if (Auth::user()->role == 'ROLE_KUPTD') {
                if ($status === "Approved") {
                    $query->where(function ($q) {
                        $q->where(function ($data) {
                            $data->where('status', "Processed")
                                ->where('current_role', Auth::user()->role);
                        })
                            ->orWhere(function ($data) {
                                $data->where('status', "Approved")
                                    ->whereNotNull('noWajibRetribusi');
                            });
                    });
                }

                if ($status === "Processed") {
                    $query->where('status', "Processed")
                        ->where('current_role', '!=', Auth::user()->role);
                }

                if ($status === "Rejected") {
                    $query->where('status', 'Rejected');
                }
            } else {
                // Untuk role lain, gunakan filter status standar
                $query->where('status', $status);
            }
        }


        if ($request->filled('per_page')) {
            $perPage = (int) $request->get('per_page', 10);
            $data = $query->take($perPage)->get();
        } else {
            $data = $query->get();
        }

        $pdf = Pdf::loadView('exports.wajib-retribusi.wajib-retribusi-pdf', compact('data'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d-H-i-s') . '.pdf';

        return $pdf->download($fileName);
    }

    public function draftPdf($id)
    {
        $data = WajibRetribusi::with(['user:id,namaLengkap,lokasi,role', 'pemilik', 'kecamatan', 'kelurahan'])->findOrFail($id);

        $skrd = Skrd::where('noWajibRetribusi', $data->noWajibRetribusi)->first();

        $user = User::firstWhere('role', 'ROLE_KABID');

        $tandaTangan = TandaTangan::first();

        $pdf = Pdf::loadView('exports.wajib-retribusi.draft-pdf', [
            'data' => $data,
            'kabid' => $user,
            'skrd' => $skrd,
            'tandaTangan' => $tandaTangan
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'dpi' => 150,
                'defaultFont' => 'arial',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => realpath("")
            ]);

        return $pdf->stream("draft-retribusi-{$data->noWajibRetribusi}.pdf");
    }

    public function export(Request $request)
    {
        $fileName = 'laporan-wajib-retribusi-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new WajibRetribusiExport($request),
            $fileName
        );
    }

    public function getImage($type, $filename)
    {
        // $path = "private/{$folder}/{$filename}";
        // $path = storage_path('app/private/' . $folder);

        $basePath = match ($type) {
            'image' => 'foto/bangunan/',
            'file' => 'foto/berkas/',
            default => abort(404)
        };

        $path = storage_path('app/private/' . $basePath . $filename);

        // dd(storage_path('app/private/'. $path));

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    // public function exportSingle($id)
    // {
    //     $export = new WajibRetribusiSingleExport($id);
    //     return Excel::download($export, 'wajib-retribusi-' . $id . '.xlsx');
    // }
}
