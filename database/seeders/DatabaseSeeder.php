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
            [
                'nip' => '198701012023011001',
                'nik' => '3276010101010001',
                'nama' => 'Boy',
                'wilayah_uptd' => 'UPTD Selatan',
            ],
            [
                'nip' => '198702022023011002',
                'nik' => '3276010202020002',
                'nama' => 'Joni',
                'wilayah_uptd' => 'UPTD Utara',
            ],
            [
                'nip' => '198703032023011003',
                'nik' => '3276010303030003',
                'nama' => 'Ari',
                'wilayah_uptd' => 'UPTD Barat',
            ],
            [
                'nip' => '198704042023011004',
                'nik' => '3276010404040004',
                'nama' => 'Joko',
                'wilayah_uptd' => 'UPTD Timur',
            ],
            [
                'nip' => '198705052023011005',
                'nik' => '3276010505050005',
                'nama' => 'Barok',
                'wilayah_uptd' => 'UPTD Tengah',
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
