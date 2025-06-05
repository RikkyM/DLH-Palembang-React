<?php

namespace Database\Seeders;

use App\Models\Uptd;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UptdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            'id', 'namaUptd', 'alamat', 'kodeKecamatan', 'created_at', 'updated_at'
        ];

        $data = [
            [4, 'SEBERANG ULU SATU', 'Jl. Sukarela No 129 A', '02', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [5, 'SEBERANG ULU DUA', 'Jl. Sukarela No 129 A', '03', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [6, 'ILIR BARAT SATU', 'Jl. Sukarela No 129 A', '04', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [7, 'ILIR TIMUR SATU', 'Jl. Sukarela No 129 A', '05', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [8, 'ILIR TIMUR DUA', 'Jl. Sukarela No 129 A', '06', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [9, 'SUKARAMI', 'Jl. Sukarela No 129 A', '07', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [10, 'SAKO', 'Jl. Sukarela No 129 A', '08', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [11, 'KEMUNING', 'Jl. Sukarela No 129 A', '09', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [12, 'KALIDONI', 'Jl. Sukarela No 129 A', '10', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [14, 'GANDUS', 'Jl. Sukarela No 129 A', '12', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [15, 'KERTAPATI', 'Jl. Sukarela No 129 A', '13', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [16, 'PLAJU', 'Jl. Sukarela No 129 A', '14', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [17, 'ALANG-ALANG LEBAR', 'Jl. Sukarela No 129 A', '15', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [19, 'JAKABARING', 'Jl. Sukarela No 129 A', '17', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [20, 'ILIR TIMUR TIGA', 'Jl. Sukarela No 129 A', '18', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [1, 'DINAS', 'Jl. Sukarela No 129 A', '07', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [3, 'ILIR BARAT DUA', 'Jl. Sukarela No 129 A', '01', '2023-10-15 00:15:54.319+07', '2023-12-06 19:36:24.287+07'],
            [18, 'SEMATANG BORANG', 'Jl. Sukarela No 129 A', '16', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
            [13, 'BUKIT KECIL', 'Jl. Sukarela No 129 A', '11', '2023-10-15 00:15:54.319+07', '2023-10-15 00:15:56.096+07'],
        ];

        $records = array_map(function($row) use ($fields) {
            $data = array_combine($fields, $row);
            $data['created_at'] = Carbon::now();
            $data['updated_at'] = Carbon::now();
            return $data;
        }, $data);

        DB::table('uptd')->insert($records);
    }
}
