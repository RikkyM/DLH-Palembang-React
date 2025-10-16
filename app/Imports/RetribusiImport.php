<?php

namespace App\Imports;

use App\Models\Kategori;
use App\Models\Kecamatan;
use App\Models\SubKategori;
use App\Models\Uptd;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\WajibRetribusi;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class RetribusiImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
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
            $uptd = Uptd::whereNamauptd(trim($row['kecamatan']))->first();
            // $pendaftar = User::whereNamalengkap(Str::title(strtolower($row['petugas_pendaftaran'])))->first();

            $tanggal = $row['tanggal_spkrd'];

            if (is_numeric($tanggal)) {
                $tanggal = Date::excelToDateTimeObject($tanggal)->format('Y-m-d');
            } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $tanggal)) {
                $tanggal = Carbon::createFromFormat('d/m/Y', $tanggal)->format('Y-m-d');
            }

            // $data[] = $pendaftar['username'] == 'opet' ? $pendaftar['namaLengkap'] : $row['petugas_pendaftaran'] . ' tidak ada';

            // $data[] = $pendaftar['namaLengkap'] ?? $row['petugas_pendaftaran'] . ' tidak ada';

            // $data[] = $kategori['namaKategori'] ?? $row['rincian_layanan'] . ' tidak ada';
            // $data[] = $sub['namaSubKategori'] ?? $row['detail_rincian'] . ' tidak ada';
            // $data[] = $kecamatan['namaKecamatan'] ?? $row['kecamatan'] . ' tidak ada';

            // $data[] = $row['no_spkrd'];

            // $data[] = [
            //     'noSkrd' => $row['no_spkrd'],
            //     'noWajibRetribusi' => $row['no_wajib_retribusi'],
            //     'kodeKategori' => $kategori['kodeKategori'],
            //     'kodeSubKategori' => $sub['kodeSubKategori'],
            //     'uptdId' => $uptd['id'],
            //     'namaObjekRetribusi' => $row['nama_objek_retribusi'],
            //     'bentukBadanUsaha' => $row['bentuk_badan_usaha'],
            //     'deskripsiUsaha' => $row['deskripsi_usaha'],
            //     'alamat' => $row['alamat_objek_retribusi'],
            //     'kodeKelurahan' => null,
            //     'kodeKecamatan' => $kecamatan['kodeKecamatan'],
            //     'keteranganBulan' => $row['keterangan_bulan'],
            //     'tanggalSkrd' => $tanggal,
            //     'petugasPendaftarId' => null,
            //     'status' => 'Finished',
            //     'current_role' => 'ROLE_KABID',
            //     'createdThisYear' => 't',
            //     'keterangan' => null,
            //     'maksud' => 'Wajib Retribusi Baru',
            //     'unit' => null,
            //     'm2' => null,
            //     'giat' => null,
            //     'hari' => null,
            //     'meter' => null,
            //     'bulan' => $row['jumlah_bulan'],
            //     'statusTempat' => null,
            //     'latitude' => null,
            //     'longitude' => null,
            //     'image' => null,
            //     'url_image' => [],
            //     'file' => null,
            //     'url_file' => [],
            //     'linkMap' => null,
            //     'jenisTarif' => 'tarif',
            //     'jumlahBangunan' => null,
            //     'jumlahLantai' => null,
            //     'keterangan' => null,
            //     'historyAction' => null,
            //     'created_at' => now(),
            //     'updated_at' => now()
            // ];

            $item = [
                'noSkrd' => $row['no_spkrd'],
                'noWajibRetribusi' => $row['no_wajib_retribusi'],
                'kodeKategori' => $kategori['kodeKategori'],
                'kodeSubKategori' => $sub['kodeSubKategori'],
                'uptdId' => $uptd['id'],
                'namaObjekRetribusi' => $row['nama_objek_retribusi'],
                'bentukBadanUsaha' => $row['bentuk_badan_usaha'],
                'deskripsiUsaha' => $row['deskripsi_usaha'],
                'alamat' => $row['alamat_objek_retribusi'],
                'kodeKelurahan' => null,
                'kodeKecamatan' => $kecamatan['kodeKecamatan'],
                'keteranganBulan' => $row['keterangan_bulan'],
                'tanggalSkrd' => $tanggal,
                'petugasPendaftarId' => null,
                'status' => 'Finished',
                'current_role' => 'ROLE_KABID',
                'createdThisYear' => 't',
                'keterangan' => null,
                'maksud' => 'Wajib Retribusi Baru',
                'unit' => null,
                'm2' => null,
                'giat' => null,
                'hari' => null,
                'meter' => null,
                'bulan' => $row['jumlah_bulan'],
                'statusTempat' => null,
                'latitude' => null,
                'kota' => 'Palembang',
                'provinsi' => 'Sumatera Selatan',
                'tarifPerbulan' => $row['tarif_perbulan'],
                'tarifPertahun' => $row['tarif_pertahun'],
                'longitude' => null,
                'image' => null,
                'url_image' => [],
                'file' => null,
                'url_file' => [],
                'linkMap' => null,
                'jenisTarif' => 'tarif',
                'jumlahBangunan' => null,
                'jumlahLantai' => null,
                'keterangan' => null,
                'historyAction' => null,
                'created_at' => now(),
                'updated_at' => now()
            ];

            WajibRetribusi::create($item);
        }

        // dd($data);
        // if (!empty($data)) {
        //     DB::table('wajib_retribusi')->insert($data);
        // }
    }
}
