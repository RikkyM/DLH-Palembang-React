<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use App\Models\TahunRetribusi;
use App\Models\TandaTangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function TandaTangan()
    {
        return Inertia::render('Super-Admin/Setting/TandaTangan', [
            'signatureData' => TandaTangan::first()
        ]);
    }

    public function TandaTanganUpdate(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'nip' => 'required|numeric',
            'pangkat' => 'required',
            'golongan' => 'required',
            'jabatan1' => 'required',
            'jabatan2' => 'required',
            'kota' => 'required'
        ]);

        // $tandaTangan = TandaTangan::first();

        // $tandaTangan->update($validated);
        TandaTangan::updateOrCreate($validated);

        return redirect()->route('super-admin.penanda-tangan')->with('success', 'Data berhasil disimpan.');
    }

    public function dataInstansi()
    {
        $instansi = Instansi::first();
        return Inertia::render('Super-Admin/Setting/DataInstansi', [
            'instansi' => $instansi
        ]);
    }

    public function dataInstansiUpdate(Request $request)
    {
        $validated = $request->validate([
            'namaInstansi' => 'required',
            'alamatInstansi' => "required",
            'noTelepon' => "required",
            'email' => "required",
            'website' => "required",
            'instagram' => "required",
            'tiktok' => "required",
        ]);

        Instansi::firstOrNew([])->fill($validated)->save();

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function tahunRetribusi()
    {
        return Inertia::render('Super-Admin/Setting/Tahun-Retribusi', [
            'itm' => TahunRetribusi::first()
        ]);
    }

    public function tahunRetribusiUpdate(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required|max:4'
        ]);

        TahunRetribusi::firstOrNew([])->fill($validated)->save();

        return back()->with('success', 'Data berhasil diupdate.');
    }

    public function informasi()
    {
        return Inertia::render('Super-Admin/Setting/Informasi');
    }
}
