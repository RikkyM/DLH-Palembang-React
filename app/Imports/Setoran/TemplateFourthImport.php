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

class TemplateFourthImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        $bulanIndonesia = [
            'Januari' => 'January',
            'Februari' => 'February',
            'Maret' => 'March',
            'April' => 'April',
            'Mei' => 'May',
            'Juni' => 'June',
            'Juli' => 'July',
            'Agustus' => 'August',
            'September' => 'September',
            'Oktober' => 'October',
            'November' => 'November',
            'Desember' => 'December'
        ];

        $data = [];
        foreach ($rows as $index => $row) {
            $skrd = Skrd::whereNoskrd($row['nomor_wajib_retribusi'])->first();

            // $data[] = $skrd ?? $row['nomor_wajib_retribusi'] . ' cek dulu';
            // if ($skrd) {
            //     $nomorNota = Setoran::generateNomorNota();

            //     $detailSetoran =
            //         collect(range(1, 12))->map(
            //             function ($i) use ($skrd, $row) {
            //                 $bulan =  strtolower(Carbon::create()->month($i)->locale('id')->translatedFormat('M'));

            //                 if ($row[$bulan] && $row[$bulan] !== null) {

            //                     $tanggal = trim($row[$bulan]);

            //                     if (is_numeric($tanggal)) {
            //                         return [
            //                             'namaBulan' => Str::title(strtolower(Carbon::create()->month($i)->translatedFormat('F'))),
            //                             'tanggalBayar' => Date::excelToDateTimeObject($row[$bulan])->format('Y-m-d'),
            //                             'jumlahBayar' => $row['per_bulan'],
            //                             'keterangan' => null,
            //                         ];
            //                     }

            //                     if (!is_numeric($tanggal[0])) {
            //                         return null;
            //                     }

            //                     if (strpos($tanggal, '/') === false) {
            //                         return null;
            //                     }

            //                     $parts = explode('/', $tanggal);

            //                     $hariInt = (int) $parts[0];
            //                     $bulanInt = (int) $parts[1];

            //                     $formatTanggal = '';

            //                     $formatTanggal = Carbon::createFromDate(now()->year, $bulanInt, $hariInt)
            //                         ->format('Y-m-d');

            //                     return [
            //                         'namaBulan' => Str::title(strtolower(Carbon::create()->month($i)->translatedFormat('F'))),
            //                         'tanggalBayar' => $formatTanggal,
            //                         'jumlahBayar' => $row['per_bulan'],
            //                         'keterangan' => null,
            //                         'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
            //                         'updated_at' => now()
            //                     ];
            //                 }
            //             }
            //         )
            //         ->filter()
            //         ->values();

            //     // if ($detailSetoran->isNotEmpty()) {
            //     //     $tanggalDiterima = $detailSetoran->pluck('tanggalBayar')[count($detailSetoran) - 1];

            //     //     Setoran::create([
            //     //         'nomorNota' => $nomorNota,
            //     //         'skrdId' => $skrd['id'],
            //     //         'noRef' => null,
            //     //         'tanggalBayar' => Carbon::now(),
            //     //         // 'jumlahBayar' => count($detailSetoran) * $row['tarif_bulan'],
            //     //         'jumlahBayar' => $row['jumlah_bayar'] ?? count($detailSetoran) * $row['per_bulan'],
            //     //         'jumlahBulan' => count($detailSetoran),
            //     //         'namaPenyetor' => null,
            //     //         'keteranganBulan' => null,
            //     //         'metodeBayar' => null,
            //     //         'namaBank' => null,
            //     //         'buktiBayar' => null,
            //     //         'status' => 'Approved',
            //     //         'current_stage' => 'bendahara',
            //     //         'keterangan' => null,
            //     //         'tanggal_diterima' => $tanggalDiterima,
            //     //         'tanggal_batal' => null,
            //     //         'created_at' => Carbon::now(),
            //     //         'updated_at' => now()
            //     //     ]);

            //     //     foreach ($detailSetoran as $det) {
            //     //         DetailSetoran::create([
            //     //             'nomorNota' => $nomorNota,
            //     //             'skrdId' => $skrd['id'],
            //     //             'namaBulan' => $det['namaBulan'],
            //     //             'tanggalBayar' =>   $det['tanggalBayar'],
            //     //             'jumlahBayar' => $det['jumlahBayar'],
            //     //             'keterangan' => null,
            //     //             'created_at' => Carbon::now(),
            //     //             'updated_at' => now()
            //     //         ]);
            //     //     }
            //     // }
            // }
        }
        // dd($data);
    }
}
