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
            $skrd = Skrd::whereNoskrd($row['nomor_spkrd'])->first();

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
                        ];
                    }
                })
                    ->filter()
                    ->values();

                // if ($detailSetoran->isNotEmpty()) {
                //     $groupTanggal = $detailSetoran->groupBy('tanggalBayar');

                //     foreach ($groupTanggal as $tanggalBayar => $details) {
                //         $nomorNota = Setoran::generateNomorNota();
                //         $totalBayar = $details->sum('jumlahBayar');
                //         $jumlahBulan = $details->count();

                //         Setoran::create([
                //             'nomorNota' => $nomorNota,
                //             'skrdId' => $skrd['id'],
                //             'noRef' => null,
                //             'tanggalBayar' => $tanggalBayar,
                //             'jumlahBayar' => $totalBayar,
                //             'jumlahBulan' => $jumlahBulan,
                //             'namaPenyetor' => null,
                //             'keteranganBulan' => null,
                //             'metodeBayar' => null,
                //             'namaBank' => null,
                //             'buktiBayar' => null,
                //             'status' => 'Approved',
                //             'current_stage' => 'bendahara',
                //             'keterangan' => $row['ket'],
                //             'tanggal_diterima' => Carbon::parse($tanggalBayar)->startOfDay(),
                //             'tanggal_batal' => null,
                //             'created_at' => Carbon::parse($tanggalBayar)->startOfDay(),
                //             'updated_at' => now()
                //         ]);

                //         foreach ($details as $detSet) {
                //             DetailSetoran::create([
                //                 'nomorNota' => $nomorNota,
                //                 'skrdId' => $skrd['id'],
                //                 'namaBulan' => $detSet['namaBulan'],
                //                 'tanggalBayar' => $detSet['tanggalBayar'],
                //                 'jumlahBayar' => $detSet['jumlahBayar'],
                //                 'keterangan' => null,
                //                 'created_at' => Carbon::parse($detSet['tanggalBayar'])->startOfDay(),
                //                 'updated_at' => now()
                //             ]);
                //         }
                //     }
                // }

                if ($detailSetoran->isNotEmpty()) {
                    $tanggalDiterima = $detailSetoran->pluck('tanggalBayar')[count($detailSetoran) - 1];
                    // $data[] = $detailSetoran;
                    Setoran::create([
                        'nomorNota' => $nomorNota,
                        'skrdId' => $skrd['id'],
                        'noRef' => null,
                        // 'tanggalBayar' => Date::excelToDateTimeObject($row['tgl_skrd'])->format('Y-m-d'),
                        'tanggalBayar' => Carbon::now(),
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
                        'tanggal_diterima' => $tanggalDiterima,
                        'tanggal_batal' => null,
                        'created_at' => Carbon::now(),
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
                            // 'created_at' => Carbon::parse($detSet['tanggalBayar'])->startOfDay(),
                            'created_at' => Carbon::now(),
                            'updated_at' => now()
                        ]);
                    }
                }
                // dd($data);
            }
        }
        // dd($data);
    }
}
