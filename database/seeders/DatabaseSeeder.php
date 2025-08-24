<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\TandaTangan;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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
