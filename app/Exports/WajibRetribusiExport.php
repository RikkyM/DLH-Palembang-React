<?php

namespace App\Exports;

use App\Models\WajibRetribusi;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class WajibRetribusiExport implements FromView, ShouldAutoSize, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return WajibRetribusi::all();
    }

    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function view(): View
    {
        $query = WajibRetribusi::with([
            'kategori',
            'subKategori',
            'kelurahan',
            'kecamatan',
            'user:id,namaLengkap',
            'pemilik',
            'uptd'
        ])
            ->orderBy('created_at', 'desc');

        $role = auth()->user()->role;

        if ($role === "ROLE_KUPTD" || $role === "ROLE_KASUBAG_TU_UPDT") {
            $query->where(function ($data) use ($role) {
                $data->where('current_role', $role)
                ->orWhere('current_role', '!=', 'ROLE_PENDAFTAR')
                ->orWhereNull('current_role')
                ->orWhere('status', 'Rejected');
            });
        }

        if ($search = $this->request->search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($q2) => $q2->where('namaLengkap', 'like', "%{$search}%"))
                    ->orWhere('namaObjekRetribusi', 'like', "%{$search}%");
            });
        }

        if ($kategori = $this->request->kategori) {
            $query->whereHas('kategori', fn($q) => $q->where('kodeKategori', $kategori));
        }

        if ($subKategori = $this->request->{'sub-kategori'}) {
            $query->whereHas('subKategori', fn($q) => $q->where('kodeSubKategori', $subKategori));
        }

        if ($kecamatan = $this->request->kecamatan) {
            $query->whereRelation('kecamatan', 'kodeKecamatan', $kecamatan);
        }

        if ($kelurahan = $this->request->kelurahan) {
            $query->whereRelation('kelurahan', 'kodeKelurahan', $kelurahan);
        }

        if ($petugas = $this->request->petugas) {
            $query->whereHas('user', fn($q) => $q->where('id', $petugas));
        }

        $status = $this->request->status;

        // if ($status) {
        //     if ($status == 'Finished') {
        //         $query->where(function ($q) {
        //             $q->where(function ($x) {
        //                 $x->where('status', 'Approved')
        //                     ->whereNull('current_role');
        //             })
        //                 ->orWhere('status', 'Finished');
        //         });
        //     } elseif ($status == 'Processed' && auth()->user()->role !== 'ROLE_SUPERADMIN') {
        //         $query->where('status', 'Processed')
        //             ->where('current_role', auth()->user()->role);
        //     } else {
        //         $query->where('status', $status);
        //     }
        // }

        if ($status) {
            if ($status === "Finished") {
                $query->where(function ($q) {
                    $q->where(function ($data) {
                        $data->where('status', 'Approved')
                            ->whereNull('current_role');
                    })->orWhere('status', 'Finished');
                });
            } else if ($status === 'Approved' && auth()->user()->role !== 'ROLE_SUPERADMIN') {
                $query->where(function ($q) {
                    $q->where('status', 'Processed')
                        ->orWhere('status', "Approved");
                })
                    ->where('current_role', auth()->user()->role);
            } else if ($status === "Processed" && auth()->user()->role !== 'ROLE_SUPERADMIN') {
                if (auth()->user()->role === "ROLE_PENDAFTAR") {
                    $query->where('status', 'Processed')
                        ->where('current_role', '!=', auth()->user()->role);
                }

                if (auth()->user()->role === "ROLE_KUPTD" || auth()->user()->role === "ROLE_KUPTD") {
                    $query->where('status', 'Processed')
                        ->where('current_role', '!=', 'ROLE_PENDAFTAR')
                        ->where('current_role', '!=', auth()->user()->role);
                }

                if (auth()->user()->role === "ROLE_KATIM") {
                    $query->where('status', 'Processed')
                        ->where('current_role', '!=', 'ROLE_PENDAFTAR')
                        ->where('current_role', '!=', 'ROLE_KUPTD')
                        ->where('current_role', '!=', auth()->user()->role);
                }
            } else {
                $query->where('status', $status);
            }
        }

        $data = $this->request->per_page != null ? $query->take((int) $this->request->get('per_page', 10))->get() : $query->get();

        return view('exports.wajib-retribusi.data-excel', compact('data'));
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
