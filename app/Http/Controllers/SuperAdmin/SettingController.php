<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\TandaTangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function TandaTangan()
    {
        // dd(TandaTangan::findOrFail(1));
        return Inertia::render('Super-Admin/Setting/TandaTangan', [
            // 'signatureData' => Inertia::defer(fn() => TandaTangan::firstOrFail())
            'signatureData' => TandaTangan::firstOrFail()
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

        // dd($validated);

        DB::transaction(function () use ($validated) {
            $tandaTangan = TandaTangan::firstOrFail();

            $tandaTangan->update($validated);
        });

        return back()->with('success', 'Data berhasil disimpan.');
    }
}
