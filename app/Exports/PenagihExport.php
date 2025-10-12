<?php

namespace App\Exports;

use App\Models\Penagih;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PenagihExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Penagih::select('nama', 'jabatan', 'statusPegawai', 'wilayah_uptd')->orderByDesc('id');

        if ($search = $this->request->search) {
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            });
        }

        $perPage = $this->request->per_page ?? 10;

        return $perPage <= 0 ? $query->get() : $query->limit($perPage)->get();
    }

    public function map($penagih): array
    {
        return [
            $penagih->nama,
            $penagih->jabatan,
            $penagih->statusPegawai,
            $penagih->wilayah_uptd
        ];
    }

    public function headings(): array
    {
        return ['NAMA', 'JABATAN', 'STATUS PEGAWAI', 'WILAYAH UPTD'];
    }

    public function styles(WorkSheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]]
        ];
    }
}
