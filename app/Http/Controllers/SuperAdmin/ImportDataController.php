<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Imports\PemohonImport;
use App\Imports\RetribusiImport;
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
        Excel::import( new RetribusiImport , $request->file('file'));

        return back();
    }
}
