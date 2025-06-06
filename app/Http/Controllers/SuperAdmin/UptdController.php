<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\Uptd;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UptdController extends Controller
{
    public function index(Request $request)
    {
        $query = Uptd::query();

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('namaUptd', 'like', "%{$searchTerm}%")
                    ->orWhere('alamat', 'like', "%{$searchTerm}%");
            });
        }

        $data = $query->paginate(10);

        $data->appends($request->only('search'));

        return Inertia::render('Super-Admin/Settings/Uptd/Index', [
            'datas' => $data,
            'kecamatan' => Kecamatan::get(),
            'filters' => [
                'search' => $request->search ?? ''
            ]
        ]);
    }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'namaUptd' => 'required',
        //     'alamat' => 'required'
        // ]);

        // // dd($validated)

        // Uptd::create($validated);

        dd($request->all());

        return redirect()->back()->withInput([]);
    }

    public function update(Request $request, Uptd $uptd)
    {
        dd($uptd);
    }
}
