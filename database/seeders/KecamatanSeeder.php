<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            'kodeKecamatan',
            'namaKecamatan',
            'slug'
        ];

        $data = [
            ['01', 'ILIR BARAT DUA', 'ilir-barat-dua'],
            ['02', 'SEBERANG ULU SATU', 'seberang-ulu-satu'],
            ['03', 'SEBERANG ULU DUA', 'seberang-ulu-dua'],
            ['04', 'ILIR BARAT SATU', 'ilir-barat-satu'],
            ['05', 'ILIR TIMUR SATU', 'ilir-timur-satu'],
            ['06', 'ILIR TIMUR DUA', 'ilir-timur-dua'],
            ['07', 'SUKARAMI', 'sukarami'],
            ['08', 'SAKO', 'sako'],
            ['09', 'KEMUNING', 'kemuning'],
            ['10', 'KALIDONI', 'kalidoni'],
            ['12', 'GANDUS', 'gandus'],
            ['13', 'KERTAPATI', 'kertapati'],
            ['14', 'PLAJU', 'plaju'],
            ['15', 'ALANG-ALANG LEBAR', 'alang-alang-lebar'],
            ['17', 'JAKABARING', 'jakabaring'],
            ['18', 'ILIR TIMUR TIGA', 'ilir-timur-tiga'],
            ['16', 'SEMATANG BORANG', 'sematangborang'],
            ['11', 'BUKIT KECIL', 'bukitkecil'],
        ];

        $records = array_map(function ($row) use ($fields) {
            $data = array_combine($fields, $row);
            $data['created_at'] = Carbon::now();
            $data['updated_at'] = Carbon::now();
            return $data;
        }, $data);

        DB::table('kecamatan')->insert($records);
    }
}
