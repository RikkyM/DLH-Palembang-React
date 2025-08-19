<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'kodeKategori' => '01',
                'namaKategori' => 'Perumahan',
                'slug' => 'perumahan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '02',
                'namaKategori' => 'Apartement/Rusun Milik (rusunami)',
                'slug' => 'apartement-rusun-milik-rusunami',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '03',
                'namaKategori' => 'Asrama',
                'slug' => 'asrama',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '04',
                'namaKategori' => 'Ruma Susun Sewa (rusunawa)',
                'slug' => 'ruma-susun-sewa-rusunawa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '05',
                'namaKategori' => 'Kos-Kosan',
                'slug' => 'kos-kosan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '06',
                'namaKategori' => 'Mini Market',
                'slug' => 'mini-market',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '07',
                'namaKategori' => 'Rumah Toko',
                'slug' => 'rumah-toko',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '08',
                'namaKategori' => 'Perkantoran',
                'slug' => 'perkantoran',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '09',
                'namaKategori' => 'Kantin/Warung/Kedai',
                'slug' => 'kantin-warung-kedai',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '10',
                'namaKategori' => 'Rumah Makan/Restoran',
                'slug' => 'rumah-makan-restoran',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '11',
                'namaKategori' => 'Pusat Jajan Serba Ada',
                'slug' => 'pusat-jajan-serba-ada',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '12',
                'namaKategori' => 'Katering',
                'slug' => 'katering',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '13',
                'namaKategori' => 'Sarana Kesehatan',
                'slug' => 'sarana-kesehatan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '14',
                'namaKategori' => 'Rumah Potong Hewan/Unggas',
                'slug' => 'rumah-potong-hewan-unggas',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '15',
                'namaKategori' => 'Showroom Motor/Mobil',
                'slug' => 'showroom-motor-mobil',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '16',
                'namaKategori' => 'SPBU',
                'slug' => 'spbu',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '17',
                'namaKategori' => 'Pusat Perbelanjaan/ Super Market/Pasar Swalayan/Hypermart',
                'slug' => 'pusar-perbelanjaan-super-market-pasar-swalayan-hypermart',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '18',
                'namaKategori' => 'Mall/Plaza',
                'slug' => 'mall-plaza',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '19',
                'namaKategori' => 'Akomodasi',
                'slug' => 'akomodasi',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '20',
                'namaKategori' => 'Bar/Pub/Klub/Diskotik/Karaoke',
                'slug' => 'bar-pub-klub-diskotik-karaoke',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '21',
                'namaKategori' => 'Massage/Panti Pijat/Spa',
                'slug' => 'massage-pantipijat-spa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '22',
                'namaKategori' => 'Panti Pijat Tuna Netra',
                'slug' => 'panti-pijat-tuna-netra',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '23',
                'namaKategori' => 'Pertemuan/Pertunjukan/Pameran/Konsentrasi Massa',
                'slug' => 'pertemuan-pertunjukan-pameran-konsentrasi-massa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '24',
                'namaKategori' => 'Gedung/Sarana Olahraga',
                'slug' => 'gedung-sarana-olahraga',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '25',
                'namaKategori' => 'Taman Hiburan/Rekreasi',
                'slug' => 'taman-hiburan-rekreasi',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '26',
                'namaKategori' => 'Terminal/Pelabuhan/Bandar Udara/Dermaga',
                'slug' => 'terminal-pelabuhan-bandar-udara-dermaga',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '27',
                'namaKategori' => 'Perguruan Tinggi',
                'slug' => 'perguruan-tinggi',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '28',
                'namaKategori' => 'Sekolah',
                'slug' => 'sekolah',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '29',
                'namaKategori' => 'Kursus/Pelatihan Swasta',
                'slug' => 'kursus-pelatihan-swasta',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '30',
                'namaKategori' => 'Pedagang Kaki Lima',
                'slug' => 'pedagang-kaki-lima',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '31',
                'namaKategori' => 'Pencucian Mobil/Motor',
                'slug' => 'pencucian-mobil-motor',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '32',
                'namaKategori' => 'Perdagangan/Pertokoan Pasar',
                'slug' => 'perdagangan-pertokoan-pasar',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '33',
                'namaKategori' => 'Perindustrian',
                'slug' => 'perindustrian',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '34',
                'namaKategori' => 'Bengkel Mobil/Variasi/Alat Berat',
                'slug' => 'bengkel-mobil-variasi-alat-berat',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '35',
                'namaKategori' => 'Bengkel Motor',
                'slug' => 'bengkel-motor',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '36',
                'namaKategori' => 'Pasar',
                'slug' => 'pasar',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '37',
                'namaKategori' => 'Bioskop/Theater/Layar Pertunjukan',
                'slug' => 'bioskop-theater-layar-pertunjukan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '38',
                'namaKategori' => 'Pergudangan',
                'slug' => 'pergudangan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '39',
                'namaKategori' => 'Depo Pelabuhan/Peti Kemas',
                'slug' => 'depo-pelabuhan-peti-kemas',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '40',
                'namaKategori' => 'Gedung Serbaguna',
                'slug' => 'gedung-serbaguna',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kodeKategori' => '41',
                'namaKategori' => 'Usaha barang/Jasa Lainya',
                'slug' => 'usaha-barang-jasa-lainya',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        DB::table('kategori')->insert($categories);
    }
}
