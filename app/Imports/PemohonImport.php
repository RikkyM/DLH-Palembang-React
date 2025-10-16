<?php

namespace App\Imports;

use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Pemilik;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PemohonImport implements ToCollection, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new Pemilik([
    //         //
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        $data = [];
        // $specificDate = Carbon::create(2025, 1, 2, 0, 0, 0);
        foreach ($rows as $row) {
            $pemohon = Pemilik::whereNik(trim($row['nik']))->first();
            $kecamatan = Kecamatan::whereNamakecamatan(trim($row['kecamatan']))->first();
            $kelurahan = Kelurahan::whereNamakelurahan(trim($row['kelurahan']))->first();

            $tanggal = $row['tanggal_lahir'] !== "-" ? $row['tanggal_lahir'] : null;

            if (is_numeric($tanggal)) {
                $tanggal = Date::excelToDateTimeObject($tanggal)->format('Y-m-d');
            } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $tanggal)) {
                $tanggal = Carbon::createFromFormat('d/m/Y', $tanggal)->format('Y-m-d');
            }

            if ($row['nik'] === '-') {
                $row['nik'] = null;
            }

            // $data[] = $row['nik'];

            // if ($pemohon) {
            //     $data[] = [
            //         'nik' => $pemohon['nik'],
            //         'nama' => $pemohon['namaPemilik'],
            //         'alamat' => $pemohon['alamat']
            //     ];
            // }


            if (!$pemohon && $kecamatan && $kelurahan) {
                $data[] = [
                    'nik' => $row['nik'] ?? null,
                    'namaPemilik' => $row['nama'],
                    'alamat' => $row['alamat'],
                    'kodeKelurahan' => $kelurahan['kodeKelurahan'],
                    'kodeKecamatan' => $kecamatan['kodeKecamatan'],
                    'tempatLahir' => $row['tempat_lahir'] ?? null,
                    'tanggalLahir' => $tanggal,
                    'noHP' => $row['nomor_hp'] ?? null,
                    'email' => $row['email'] ?? null,
                    'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                    'updated_at' => Carbon::create(2025, 1, 2, 0, 0, 0)
                ];
            }
        }

        // dd($data);

        if (!empty($data)) {
            DB::table('pemilik')->insert($data);
        }


        // dd(array_map(function ($item) {
        //     return $item ? $item->toArray() : null;
        // }, $data));

    }
}
