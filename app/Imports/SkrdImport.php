<?php

namespace App\Imports;

use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\Skrd;
use App\Models\SubKategori;
use App\Models\Uptd;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class SkrdImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new Skrd([
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
            $uptd = Uptd::whereNamauptd(trim($row['kecamatan']))->first();
            $wr = WajibRetribusi::whereNowajibretribusi($row['no_wajib_retribusi'])->first();

            $tanggal = $row['tanggal_spkrd'];

            if (is_numeric($tanggal)) {
                $tanggal = Date::excelToDateTimeObject($tanggal)->format('Y-m-d');
            } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $tanggal)) {
                $tanggal = Carbon::createFromFormat('d/m/Y', $tanggal)->format('Y-m-d');
            }

            // $data[] = $wr['id'];

            $item = [
                'noSkrd' => $row['no_spkrd'],
                'noWajibRetribusi' => $row['no_wajib_retribusi'],
                'namaKategori' => $kategori['namaKategori'],
                'namaSubKategori' => $sub['namaSubKategori'],
                'uptdId' => $uptd['id'],
                'namaObjekRetribusi' => $row['nama_objek_retribusi'],
                'bentukBadanUsaha' => $row['bentuk_badan_usaha'],
                'deskripsiUsaha' => $row['deskripsi_usaha'],
                'alamatObjekRetribusi' => $row['alamat_objek_retribusi'],
                'kelurahanObjekRetribusi' => null,
                'kecamatanObjekRetribusi' => $kecamatan['kodeKecamatan'],
                'keteranganBulan' => $row['keterangan_bulan'],
                'tanggalSkrd' => $tanggal,
                'namaPendaftar' => null,
                'status' => 'Finished',
                'createdThisYear' => 't',
                'keterangan' => null,
                'maksud' => 'Wajib Retribusi Baru',
                'unit' => null,
                'm2' => null,
                'giat' => null,
                'hari' => null,
                'meter' => null,
                'jumlahBulan' => $row['jumlah_bulan'],
                'statusTempat' => null,
                'kota' => 'Palembang',
                'provinsi' => 'Sumatera Selatan',
                'tagihanPerBulanSkrd' => $row['tarif_perbulan'],
                'tagihanPerTahunSkrd' => $row['tarif_pertahun'],
                'tarifPerBulanObjekRetribusi' => 'Rp ' . number_format($row['tarif_perbulan'], 2, ',', '.'),
                'tarifPerTahunObjekRetribusi' => 'Rp ' . number_format($row['tarif_pertahun'], 2, ',', '.'),
                'terbilangTahun' => terbilang($row['tarif_pertahun']),
                'terbilangBulan' => terbilang($row['tarif_perbulan']),
                'latitudeObjekRetribusi' => null,
                'longitudeObjekRetribusi' => null,
                'tahun' => date('Y'),
                'objekRetribusiId' => $wr['id'],
                'statusSkrd' => 'Approved Kabid',
                'image' => null,
                'url_image' => json_encode([]),
                'fileSkrd' => null,
                'url_fileSkrd' => json_encode([]),
                'linkMap' => null,
                'jenisTarif' => 'tarif',
                'jumlahBangunan' => null,
                'jumlahLantai' => null,
                'keterangan' => null,
                'historyAction' => null,
                'varetribusi' => null,
                'created_at' => Carbon::create(2025, 1, 2, 0, 0, 0),
                'updated_at' => now(),
            ];

            Skrd::create($item);
        }



        // dd($data);
    }
}
