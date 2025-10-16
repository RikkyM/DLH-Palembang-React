<?php

namespace App\Imports;

use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\SubKategori;
use App\Models\WajibRetribusi;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class RetribusiImport implements ToCollection, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new WajibRetribusi([
    //         //
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        $data = [];

        foreach ($rows as $row) {
            $cleanSub = preg_replace('/\s+/', ' ', trim($row['detail_rincian']));
            $kategori = Kategori::whereNamakategori(trim($row['rincian_layanan']))->first();
            $sub = SubKategori::whereNamasubkategori($cleanSub)->first();
            $kecamatan = Kecamatan::whereNamakecamatan(trim($row['kecamatan']))->first();

            // $data[] = $kategori['namaKategori'] ?? $row['rincian_layanan'] . ' tidak ada';
            // $data[] = $sub['namaSubKategori'] ?? $row['detail_rincian'] . ' tidak ada';
            $data[] = $kecamatan['namaKecamatan'] ?? $row['kecamatan'] . ' tidak ada';

            // $data[] = [
            //     'noSkrd' => $row['no_spkrd'],
            //     'noWajibRetribusi' => $row['no_wajib_retribusi'],
            //     'kategori' => $kategori['kodeKategori'],
            //     'subKategori' => $sub['kodeSubKategori']
            // ];
        }

        dd($data);
    }
}
