<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Uptd;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $users = User::query()
            ->when($search && trim($search) !== '', function ($query) use ($search) {
                $query->where('namaLengkap', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        $uptdOptions = Uptd::select('id', 'namaUptd')
            ->orderBy('namaUptd')
            ->get()
            ->map(function ($uptd) {
                return [
                    'value' => $uptd->id,
                    'label' => $uptd->namaUptd
                ];
            });

        return Inertia::render('Super-Admin/Settings/User/Index', [
            'users' => $users,
            'uptd' => $uptdOptions,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        try {
            $validated = $request->validated();

            User::create([
                'namaLengkap' => $validated['namaLengkap'],
                'jabatan' => $validated['jabatan'],
                'nip' => $validated['nip'],
                'email' => $validated['email'],
                'lokasi' => $validated['lokasi'],
                'kelamin' => $validated['kelamin'],
                'uptdId' => $validated['uptdId'],
                'pangkat' => $validated['pangkat'],
                'golongan' => $validated['golongan'],
                'deskripsi' => $validated['deskripsi'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->back();
        } catch (Exception $e) {

            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
