<?php

namespace App\Imports;

use App\Models\Kategori;
use App\Models\SubKategori;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SubKategoriImport implements ToCollection, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new SubKategori([
    //         //
    //     ]);
    // }
    public function collection(Collection $rows)
    {
        $p = [];
        foreach ($rows as $row) {
            $kategori = Kategori::with('subKategori')->where('namaKategori', $row['rincian_layanan'])
                ->first();

            if ($kategori) {
                $sub = SubKategori::where('kodeKategori', $kategori->kodeKategori)
                    ->where('namaSubKategori', trim($row['detail_rincian_layanan']))
                    ->first();

                if ($sub) {
                    $sub->update([
                        'tarif'  => $row['tarif1'] ?? null,
                        'tarif2' => $row['tarif2'] ?? null,
                    ]);

                    // $p[] = [
                    //     'kategori' => $kategori->namaKategori,
                    //     'sub kategori' => $sub->namaSubKategori
                    // ];
                }
            }
        }

        // dd($p);
    }
}
