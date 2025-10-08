<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapitulasiController extends Controller
{
    public function spkrd()
    {
        return Inertia::render('Super-Admin/Rekapitulasi/Spkrd');
    }
}
