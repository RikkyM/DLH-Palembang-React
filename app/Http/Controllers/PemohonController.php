<?php

namespace App\Http\Controllers;

use App\Exports\PemohonExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class PemohonController extends Controller
{
    // public function getKtp($filename)
    // {
    //     $path = storage_path('app/private/foto/ktp/' . $filename);

    //     if (!file_exists($path)) {
    //         abort(404);
    //     }

    //     return response()->file($path);
    // }

    public function exportPemohon(Request $request)
    {
        $fileName = 'pemohon-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new PemohonExport($request),
            $fileName
        );
    }
}
