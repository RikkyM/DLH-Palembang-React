<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Penagih;
use App\Models\TandaTangan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        DB::table('penagih')->insert([
            ['nama' => 'Aan Firmansyah, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Sukarami', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Akmal, S.P.', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Seberang Ulu Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Fahnan Fitriansyah, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Plaju', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Firmansyah, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Ilir Barat Dua', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Juhairiah, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Ilir Timur Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Mariyah Ulpa, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Ilir Timur Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Reka Robinsyah, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Gandus', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Riki Azmi Perdana, Se, M.Si', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Ilir Barat Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Sandi Irawan, S.IP., M.Si', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Sukarami', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Supatman, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Kemuning', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Zulfahmi, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Kertapati', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Aguscik', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'TPA', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Ahmad Faisal Ridha', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Kemuning', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Ahmad Junaidi', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Seberang Ulu Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Idham Ali', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Alang Alang Lebar', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Muhammad Andi', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Seberang Ulu Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Muhammad Ridho Hizrian', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Bukit Kecil', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Nopran Efendi', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PPPK', 'wilayah_uptd' => 'Ilir Timur Tiga', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Anggi Okta Perdana, S.T', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'TPA', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Dodi Yosaktavano', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Ilir Timur Tiga', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Endi Frasmihayati', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Jakabaring', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Salsadila', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Jakabaring', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Hanggara Wibowo, S.Kep/CPNS', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Ilir Barat Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Chelly Monica, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Ilir Timur Tiga', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'M. Okky Aryansen, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'PHL', 'wilayah_uptd' => 'Plaju', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Lailatul Adzkia, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'S. Borang', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Karnila Olivia Siska, S.IP', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'Ilir Barat Satu', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Novi, S.E', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'Ilir Barat Dua', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Sibaren Dwyangga, A.Md', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'Ilir Timur Tiga', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Muhammad Abduh', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'Kalidoni', 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Erwin, S.Sos', 'jabatan' => 'Penagih Retribusi', 'statusPegawai' => 'Non Pnsd', 'wilayah_uptd' => 'Sako', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('badan_usaha')->insert([
            [
                'namaBadanUsaha' => 'Koperasi',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Perseorangan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Firma (Fa)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Persekutuan Komanditer (CV)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Perseroan Terbatas',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Badan Usaha Milik Negara (BUMN)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Badan Usaha Milik Daerah (BUMD)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Badan Usaha Milik Swasta (BUMS)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'namaBadanUsaha' => 'Badan Usaha Campuran',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        $this->call([
            KecamatanSeeder::class,
            KelurahanSeeder::class,
            UptdSeeder::class,
            UserSeeder::class,
            KategoriSeeder::class,
            SubKategoriSeeder::class,
            PemilikSeeder::class,
            WajibRetribusiSeeder::class,
            SkrdSeeder::class,
            PembayaranSeeder::class
        ]);

        TandaTangan::create([
            'nama' => "Andika Marta Dinata, S.T., M.T",
            'nip' => "198003162003121005",
            'pangkat' => "Pembina",
            'golongan' => "4A",
            'Jabatan1' => "An. Kepala Dinas Lingkungan Hidup",
            'Jabatan2' => "Kepala Bidang Pengelolaan Sampah dan Limbah B3",
            'kota' => "Kota Palembang"
        ]);
    }
}
