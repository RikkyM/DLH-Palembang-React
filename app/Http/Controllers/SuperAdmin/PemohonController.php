<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemohonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortBy = $request->get('sort', 'id');
        $sortDir = $request->get('direction', 'asc');

        $query = Pemilik::with(['kecamatan', 'kelurahan']);

        if ($search && trim($search) !== '') {
            $query->where('namaPemilik', 'like', "%{$search}%");
        }

        switch ($sortBy) {
            case 'kodeKecamatan':
                $query->leftJoin('kecamatan', 'pemilik.kodeKecamatan', '=', 'kecamatan.kodeKecamatan')
                    ->orderBy('kecamatan.namaKecamatan', $sortDir)
                    ->select('pemilik.*');
                break;

            case 'kodeKelurahan':
                $query->leftJoin('kelurahan', 'pemilik.kodeKelurahan', '=', 'kelurahan.kodeKelurahan')
                    ->orderBy('kelurahan.namaKelurahan', $sortDir)
                    ->select('pemilik.*');
                break;

            default:
                if (in_array($sortBy, ['id', 'nik', 'namaPemilik', 'alamat', 'tempatLahir', 'tanggalLahir', 'noHP', 'email', 'jabatan'])) {
                    $query->orderBy($sortBy, $sortDir);
                } else {
                    $query->orderBy('id', $sortDir);
                }
                break;
        }

        $kecamatanOptions = Kecamatan::select('kodeKecamatan', 'namaKecamatan')
            ->orderBy('namaKecamatan')
            ->get()
            ->map(function ($kecamatan) {
                return [
                    'value' => $kecamatan->kodeKecamatan,
                    'label' => $kecamatan->namaKecamatan
                ];
            });

        $kelurahanOptions = Kelurahan::select('kodeKelurahan', 'namaKelurahan', 'kodeKecamatan')
            ->orderBy('namaKelurahan')
            ->get()
            ->groupBy('kodeKecamatan')
            ->map(function ($groupedKelurahan) {
                return $groupedKelurahan->map(function ($kelurahan) {
                    return [
                        'value' => $kelurahan->kodeKelurahan,
                        'label' => $kelurahan->namaKelurahan
                    ];
                })->values(); // reset key index
            });

        $pemohon = $query->paginate(10)->withQueryString();

        return Inertia::render('Super-Admin/Data-Input/Pemohon/Index', [
            'datas' => $pemohon,
            'filters' => [
                'search' => $search && trim($search) !== '' ? $search : null,
                'sort' => $sortBy,
                'direction' => $sortDir
            ],
            'kecamatanOptions' => $kecamatanOptions,
            'kelurahanOptions' => $kelurahanOptions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|digits:16',
            'namaPemilik' => 'required|string|min:5',
            'alamat' => 'required|string|min:5|max:255',
            'tempatLahir' => 'required|string|min:3',
            'tanggalLahir' => 'required|date',
            'kodeKecamatan' => 'required|exists:kecamatan,kodeKecamatan',
            'kodeKelurahan' => 'required|exists:kelurahan,kodeKelurahan',
            'noHP' => 'required|digits_between:12,14',
            'email' => 'required|email|min:5',
            'jabatan' => 'required|string|min:3',
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus terdiri dari 16 digit angka.',
            'namaPemilik.required' => 'Nama pemilik wajib diisi.',
            'namaPemilik.min' => 'Nama pemilik minimal terdiri dari 5 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'alamat.min' => 'Alamat minimal 5 karakter.',
            'alamat.max' => 'Alamat maksimal 255 karakter.',
            'tempatLahir.required' => 'Tempat lahir wajib diisi.',
            'tempatLahir.min' => 'Tempat lahir minimal 3 karakter.',
            'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggalLahir.date' => 'Format tanggal lahir tidak valid.',
            'kodeKecamatan.required' => 'Kecamatan wajib dipilih.',
            'kodeKecamatan.exists' => 'Kecamatan yang dipilih tidak valid.',
            'kodeKelurahan.required' => 'Kelurahan wajib dipilih.',
            'kodeKelurahan.exists' => 'Kelurahan yang dipilih tidak valid.',
            'noHP.required' => 'Nomor HP wajib diisi.',
            'noHP.digits_between' => 'Nomor HP harus terdiri dari 12 sampai 14 digit angka.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.min' => 'Email minimal 5 karakter.',
            'jabatan.required' => 'Jabatan wajib diisi.',
            'jabatan.min' => 'Jabatan minimal 3 karakter.',
        ]);

        try {
            $p = Pemilik::create([
                'nik' => trim($validated['nik']),
                'namaPemilik' => trim($validated['namaPemilik']),
                'alamat' => trim($validated['alamat']),
                'tempatLahir' => trim($validated['tempatLahir']),
                'tanggalLahir' => $validated['tanggalLahir'],
                'kodeKecamatan' => $validated['kodeKecamatan'],
                'kodeKelurahan' => $validated['kodeKelurahan'],
                'noHP' => $validated['noHP'],
                'email' => trim($validated['email']),
                'jabatan' => trim($validated['jabatan']),
            ]);

            return back();
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
        $validated = $request->validate([
            'nik' => 'nullable|digits:16',
            'namaPemilik' => 'nullable|string|min:5',
            'alamat' => 'nullable|string|min:5|max:255',
            'tempatLahir' => 'nullable|string|min:3',
            'tanggalLahir' => 'nullable|date',
            'kodeKecamatan' => 'nullable|exists:kecamatan,kodeKecamatan',
            'kodeKelurahan' => 'nullable|exists:kelurahan,kodeKelurahan',
            'noHP' => 'nullable|digits_between:12,14',
            'email' => 'nullable|email|min:5',
            'jabatan' => 'nullable|string|min:3',
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus terdiri dari 16 digit angka.',
            'namaPemilik.required' => 'Nama pemilik wajib diisi.',
            'namaPemilik.min' => 'Nama pemilik minimal terdiri dari 5 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'alamat.min' => 'Alamat minimal 5 karakter.',
            'alamat.max' => 'Alamat maksimal 255 karakter.',
            'tempatLahir.required' => 'Tempat lahir wajib diisi.',
            'tempatLahir.min' => 'Tempat lahir minimal 3 karakter.',
            'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggalLahir.date' => 'Format tanggal lahir tidak valid.',
            'kodeKecamatan.required' => 'Kecamatan wajib dipilih.',
            'kodeKecamatan.exists' => 'Kecamatan yang dipilih tidak valid.',
            'kodeKelurahan.required' => 'Kelurahan wajib dipilih.',
            'kodeKelurahan.exists' => 'Kelurahan yang dipilih tidak valid.',
            'noHP.required' => 'Nomor HP wajib diisi.',
            'noHP.digits_between' => 'Nomor HP harus terdiri dari 12 sampai 14 digit angka.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.min' => 'Email minimal 5 karakter.',
            'jabatan.required' => 'Jabatan wajib diisi.',
            'jabatan.min' => 'Jabatan minimal 3 karakter.',
        ]);

        try {
            $pemilik = Pemilik::findOrFail($id);

            $pemilik->update([
                'nik' => trim($validated['nik']) ?? $pemilik->nik,
                'namaPemilik' => $validated['namaPemilik'] ?? $pemilik->namaPemilik,
                'alamat' => $validated['alamat'] ?? $pemilik->alamat,
                'tempatLahir' => $validated['tempatLahir'] ?? $pemilik->tempatLahir,
                'tanggalLahir' => $validated['tanggalLahir'] ?? $pemilik->tanggalLahir,
                'kodeKecamatan' => $validated['kodeKecamatan'] ?? $pemilik->kodeKecamatan,
                'kodeKelurahan' => $validated['kodeKelurahan'] ?? $pemilik->kodeKelurahan,
                'noHP' => $validated['noHP'] ?? $pemilik->noHP,
                'email' => $validated['email'] ?? $pemilik->email,
                'jabatan' => $validated['jabatan'] ?? $pemilik->jabatan,
            ]);

            return redirect()->back()->with('success', 'Data pemohon berhasil diperbarui.');
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
