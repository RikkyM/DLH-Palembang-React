<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UptdController extends Controller
{
    public function index()
    {
        return Inertia::render('Super-Admin/Settings/Uptd/Index');
    }
}
