<?php

namespace App\Exports;

use App\Models\Skrd;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;

class SkrdExport implements FromArray
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
            ['No. Wajib Retribusi', 'Nama', 'Alamat', 'Kategori', 'Sub Kategori', 'Tagihan Per Tahun'],
            [$data->noWajibRetribusi, $data->user->namaLengkap, $data->alamatObjekRetribusi, $data->namaKategori, $data->namaSubKategori, $data->tagihanPerTahunSkrd],
        ];
    }
}
