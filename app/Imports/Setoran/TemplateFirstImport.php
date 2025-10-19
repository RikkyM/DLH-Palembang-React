<?php

namespace App\Imports\Setoran;

use App\Models\DetailSetoran;
use App\Models\Setoran;
use App\Models\Skrd;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class TemplateFirstImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        $data = [];
        foreach ($rows as $index => $row) {
            $skrd = Skrd::whereNowajibretribusi($row['nomor_spkrd'])->first();

            if ($skrd) {
                $nomorNota = Setoran::generateNomorNota();
                $detailSetoran = collect(range(1, 12))->map(function ($i) use ($skrd, $row) {
                    if ($row['jmlh_bayar' . $i] !== null && $row['tgl_bayar' . $i] !== null) {
                        return [
                            'skrdId' => $skrd['id'],
                            'namaBulan' => Str::title(strtolower(Carbon::create()->month($i)->translatedFormat('F'))),
                            'tanggalBayar' => Date::excelToDateTimeObject($row['tgl_bayar' . $i])->format('Y-m-d'),
                            'jumlahBayar' => $row['jmlh_bayar' . $i],
                            'keterangan' => null,
                            'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                            'updated_at' => now()
                        ];
                    }
                })
                    ->filter()
                    ->values()
                    ->toArray();

                if ($detailSetoran) {
                    Setoran::create([
                        'nomorNota' => $nomorNota,
                        'skrdId' => $skrd['id'],
                        'noRef' => null,
                        'tanggalBayar' => Date::excelToDateTimeObject($row['tgl_skrd'])->format('Y-m-d'),
                        'jumlahBayar' => $row['sudah_bayar'],
                        'jumlahBulan' => count($detailSetoran),
                        'namaPenyetor' => null,
                        'keteranganBulan' => null,
                        'metodeBayar' => null,
                        'namaBank' => null,
                        'buktiBayar' => null,
                        'status' => 'Approved',
                        'current_stage' => 'bendahara',
                        'keterangan' => $row['ket'],
                        'tanggal_diterima' => Carbon::create(2025, 1, 2, 0, 0, 0),
                        'tanggal_batal' => null,
                        'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                        'updated_at' => now()
                    ]);

                    foreach ($detailSetoran as $detSet) {
                        DetailSetoran::create([
                            'nomorNota' => $nomorNota,
                            'skrdId' => $skrd['id'],
                            'namaBulan' => $detSet['namaBulan'],
                            'tanggalBayar' => $detSet['tanggalBayar'],
                            'jumlahBayar' => $detSet['jumlahBayar'],
                            'keterangan' => null,
                            'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                            'updated_at' => now()
                        ]);
                    }
                }
            }
        }

        // dd($data);
    }
}
