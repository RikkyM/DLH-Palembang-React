<?php

namespace App\Exports;

use App\Models\Skrd;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SkrdExport implements FromArray, ShouldAutoSize
{
    protected $id;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function array(): array
    {
        $data = Skrd::with('user')->findOrFail($this->id);

        return [
            ['No. Wajib Retribusi', 'Nama Objek Retribusi', 'Alamat', 'Kategori', 'Sub Kategori', 'Tagihan Per Bulan', 'Tagihan Per Tahun'],
            [$data->noWajibRetribusi, $data->namaObjekRetribusi, $data->alamatObjekRetribusi, $data->namaKategori, $data->namaSubKategori, $data->tagihanPerTahunSkrd],
        ];
    }
}
