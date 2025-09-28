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
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');

        $users = User::query()
            ->whereNotNull('username')
            ->where('username', '<>', '')
            ->when($search && trim($search) !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('namaLengkap', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%");
                });
            })
            ->whereNotExists(function ($q) {
                $q->from('users as u2')
                    ->whereColumn('u2.namaLengkap', 'users.namaLengkap')
                    ->whereColumn('u2.role', 'users.role')
                    ->whereNotNull('u2.username')
                    ->where('u2.username', '<>', '')
                    ->whereColumn('u2.id', '>', 'users.id');
            })
            ->orderBy($sortBy, $sortDir)
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

        return Inertia::render('Super-Admin/Master-Data/User/Index', [
            'users' => $users,
            'uptd' => $uptdOptions,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir
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
                'username' => $validated['username'],
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
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'namaLengkap' => 'nullable|string|max:50',
            'jabatan' => 'nullable|string|max:100',
            'nip' => 'nullable|numeric',
            'username' => 'nullable',
            'email' => 'nullable|email',
            'lokasi' => 'nullable|string|max:255',
            'kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'uptdId' => 'nullable|exists:uptd,id',
            'pangkat' => 'nullable|string|max:100',
            'golongan' => 'nullable|string|max:100',
            'deskripsi' => 'nullable|string|max:255',
            'role' => 'nullable|string|in:ROLE_SEKDIN,ROLE_PENDAFTAR,ROLE_KUPTD,ROLE_KATIM,ROLE_KASUBAG_TU_UPDT,ROLE_KADIN,ROLE_KABID,ROLE_BENDAHARA',
            'password' => 'nullable|string|min:5|confirmed'
        ], (new UserRequest())->messages());


        try {
            $user = User::findOrFail($id);

            $updateData = [];
            foreach ($validated as $key => $value) {
                if ($key !== 'password') {
                    $updateData[$key] = $value;
                }
            }

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            return redirect()->back()->with('success', 'Data pengguna berhasil diperbarui.');
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
