<?php

namespace App\Http\Controllers;

use App\Models\TahunRetribusi;
use App\Models\TandaTangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    private function getRole()
    {
        $role = Auth::user()->role;

        return match ($role) {
            'ROLE_SUPERADMIN'       => 'Super-Admin',
            'ROLE_PENDAFTAR'        => 'Pendaftar',
            'ROLE_KUPTD'            => 'Kuptd',
            'ROLE_KATIM'            => 'Katim',
            'ROLE_KABID'            => 'Kabid',
            'ROLE_KASUBAG_TU_UPDT'  => 'Kasubag',
            'ROLE_BENDAHARA'        => 'Bendahara',
            default                 => null
        };
    }

    public function tahunRetribusi()
    {
        return Inertia::render("{$this->getRole()}/Setting/Tahun-Retribusi", [
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
}
