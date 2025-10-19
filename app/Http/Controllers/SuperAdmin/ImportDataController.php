<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Imports\PemohonImport;
use App\Imports\RetribusiImport;
use App\Imports\SetoranImport;
use App\Imports\SkrdImport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ImportDataController extends Controller
{
    public function importPemohonIndex()
    {
        return view('imports.pemohon');
    }

    public function importExcelPemohon(Request $request)
    {
        // dd('asd');
        Excel::import(new PemohonImport, $request->file('file'));

        return back();
    }

    public function importRetribusiIndex()
    {
        return view('imports.retribusi');
    }

    public function importExcelRetribusi(Request $request)
    {
        Excel::import(new RetribusiImport, $request->file('file'));

        return back();
    }

    public function importExcelSkrd(Request $request)
    {
        Excel::import(new SkrdImport, $request->file('skrd'));

        return back();
    }

    public function importSetoranIndex()
    {
        return view('imports.setoran');
    }

    public function importExcelSetoran(Request $request)
    {
        Excel::import(new SetoranImport, $request->file('file'));

        return back();
    }

    // private function getBulan()
    // {
    //     Carbon::setLocale('id');

    //     return collect(range(1, 12))->map(
    //         fn($i) =>
    //         strtoupper(Carbon::create()->month($i)->translatedFormat('F'))
    //     );
    // }
}
