<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Informasi;
use App\Models\Instansi;
use App\Models\TahunRetribusi;
use App\Models\TandaTangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        return Inertia::render('Super-Admin/Setting/Informasi', [
            'info' => Informasi::first()
        ]);
    }

    public function informasiUpdate(Request $request)
    {
        $validated = $request->validate([
            'gambar' => 'required|file|mimes:jpeg,jpg,png|max:5012'
        ]);

        $gambar = $validated['gambar'];

        $filename = 'Informasi_'. Date('mdY_His') . '.' . $gambar->getClientOriginalExtension();
        $path = $gambar->storeAs('foto/informasi', $filename, 'local');

        $informasi = Informasi::firstOrNew([]);
        
        if ($informasi->gambar && Storage::disk('local')->exists($informasi->gambar)) {
            Storage::disk('local')->delete($informasi->gambar);
        }

        $informasi->gambar = $path;
        $informasi->save();

        return back()->with('success', 'Berhasil Mengupdate Informasi.');
    }
}
