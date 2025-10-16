<?php

namespace App\Imports;

use App\Models\Setoran;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SetoranImport implements ToCollection, WithCalculatedFormulas
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    // public function model(array $row)
    // {
    //     return new Setoran([
    //         //
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        $data = [];
        foreach ($rows as $row) {
            // $tanggalBayar = $row['tgl_bayar'];
            // $jumlahBayar = $row['jmlh_bayar'];

            // foreach ($tanggalBayar as $index => $tglBayar) {
            //     $data[] = [
            //         'tgl_bayar' => $tglBayar,
            //         'jmlh_bayar' => $jumlahBayar[$index]
            //     ];
            // }
            $data[] = $row;
        }

        dd($data);
    }
}
