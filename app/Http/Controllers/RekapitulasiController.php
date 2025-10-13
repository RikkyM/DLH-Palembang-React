<?php

namespace App\Http\Controllers;

use App\Exports\RekapRetribusiExport;
use App\Exports\RekapSpkrdExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class RekapitulasiController extends Controller
{
    public function exportSpkrd(Request $request)
    {
        $filename = "Rekap-SPKRD-" . date('d-m-Y_H:i:s') . '.xlsx';

        return Excel::download(
            new RekapSpkrdExport($request),
            $filename
        );
    }
    
    public function exportRetribusi(Request $request)
    {
        $filename =  "Rekap-Retribusi-" . Date('d-m-Y_H:i:s') . ".xlsx";

        return Excel::download(
            new RekapRetribusiExport($request),
            $filename
        );
    }
}
