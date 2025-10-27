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

class TemplateSecondImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        $data = [];
        $detail = [];
        foreach ($rows as $index => $row) {
            $skrd = Skrd::whereNoskrd($row['nomor_spkrd'])->first();

            if ($skrd && $skrd['noSkrd']) {
                $nomorNota = Setoran::generateNomorNota();

                $detailSetoran =
                    collect(range(1, 12))->map(
                        function ($i) use ($skrd, $row) {
                            $bulan =  strtolower(Carbon::create()->month($i)->locale('id')->translatedFormat('M'));

                            if ($row[$bulan] && $row[$bulan] !== null) {
                                // $parts = explode('/', $row[$bulan]);
                                // $hari = (int) $parts[0];
                                // $bulan = (int) $parts[1];

                                $tanggal = trim($row[$bulan]);

                                if (!is_numeric($tanggal[0])) {
                                    return null;
                                }

                                if (strpos($tanggal, '/') === false) {
                                    return null;
                                }

                                $parts = explode('/', $tanggal);

                                $hari = (int) $parts[0];
                                $bulan = (int) $parts[1];

                                $formatTanggal = Carbon::createFromDate(now()->year, $bulan, $hari)
                                    ->format('Y-m-d');

                                return [
                                    'namaBulan' => Str::title(strtolower(Carbon::create()->month($i)->translatedFormat('F'))),
                                    'tanggalBayar' => $formatTanggal,
                                    'jumlahBayar' => $row['per_bulan'],
                                    'keterangan' => null,
                                ];
                            }

                            // return [
                            //     'namaBulan' => strtolower(Carbon::create()->month($i)->locale('id')->translatedFormat('M'))
                            // ];
                        }
                    )
                    ->filter()
                    ->values();

                if ($detailSetoran->isNotEmpty()) {
                    $tanggalDiterima = $detailSetoran->pluck('tanggalBayar')[count($detailSetoran) - 1];

                    Setoran::create([
                        'nomorNota' => $nomorNota,
                        'skrdId' => $skrd['id'],
                        'noRef' => null,
                        'namaKecamatan' => Str::title(strtolower($row['kecamatan'])),
                        'tanggalBayar' => Carbon::now(),
                        'jumlahBayar' => $row['jumlah_tertagih'],
                        'jumlahBulan' => count($detailSetoran),
                        'namaPenyetor' => null,
                        'keteranganBulan' => null,
                        'metodeBayar' => null,
                        'namaBank' => null,
                        'buktiBayar' => null,
                        'status' => 'Approved',
                        'current_stage' => 'bendahara',
                        'keterangan' => null,
                        'tanggal_diterima' => $tanggalDiterima,
                        'tanggal_batal' => null,
                        'created_at' => Carbon::now(),
                        'updated_at' => now()
                    ]);

                    foreach ($detailSetoran as $d) {
                        DetailSetoran::create([
                            'nomorNota' => $nomorNota,
                            'skrdId' => $skrd['id'],
                            'namaBulan' => $d['namaBulan'],
                            'namaKecamatan' => Str::title(strtolower($row['kecamatan'])),
                            'tanggalBayar' =>   $d['tanggalBayar'],
                            'jumlahBayar' => $d['jumlahBayar'],
                            'keterangan' => null,
                            'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                            'updated_at' => now()
                        ]);
                    }
                }
            }
        }

        // dd($data, $detail);
        // dd($detail);
    }
}
