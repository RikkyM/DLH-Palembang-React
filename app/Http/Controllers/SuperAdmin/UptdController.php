<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
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
            'filters' => [
                'search' => $request->search ?? ''
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaUptd' => 'required|min:5',
            'alamat' => 'required|min:8'
        ], [
            'namaUptd.required' => 'Nama UPTD wajib diisi.',
            'namaUptd.min' => 'Nama UPTD minimal 5 karakter',
            'alamat.required' => 'Alamat wajib diisi.',
            'alamat.min' => 'Alamat minimal 5 karakter',
        ]);

        Uptd::create($validated);

        return redirect()->back()->withInput([]);
    }

    public function update(Request $request, Uptd $uptd)
    {
        $validated = $request->validate([
            'namaUptd' => 'sometimes|nullable|min:5',
            'alamat' => 'sometimes|nullable|min:8'
        ]);

        $uptd->update($validated);

        return redirect()->back()->withInput([]);
    }

    public function destroy(Uptd $uptd)
    {
        $uptd->delete();

        return redirect()->back();
    }
}
