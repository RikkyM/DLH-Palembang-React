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
        ])->where('status', 'Approved');

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
            $query->whereHas('kecamatan', fn($q) => $q->where('kodeKecamatan', $kecamatan));
        }

        if ($kelurahan = $this->request->kelurahan) {
            $query->whereHas('kelurahan', fn($q) => $q->where('kodeKelurahan', $kelurahan));
        }

        if ($petugas = $this->request->petugas) {
            $query->whereHas('user', fn($q) => $q->where('id', $petugas));
        }

        $data = $query->get();

        return view('exports.wajib-retribusi', compact('data'));
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
