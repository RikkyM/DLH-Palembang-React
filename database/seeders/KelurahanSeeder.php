<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelurahanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            'kodeKelurahan',
            'kodeKecamatan',
            'namaKelurahan',
            'slug',
            'created_at',
            'updated_at'
        ];

        $data = [
            ['03.01', '03', 'SEBELAS ULU', 'sebelas-ulu', NULL, NULL],
            ['03.07', '03', 'SENTOSA', 'sentosa', NULL, NULL],
            ['08.01', '08', 'SUKAMAJU', 'sukamaju', NULL, NULL],
            ['08.02', '08', 'SAKO', 'sako', NULL, NULL],
            ['09.02', '09', 'ARIO KEMUNING', 'ario-kemuning', NULL, NULL],
            ['09.04', '09', 'PAHLAWAN', 'pahlawan', NULL, NULL],
            ['10.02', '10', 'KALIDONI', 'kalidoni', NULL, NULL],
            ['12.01', '12', 'GANDUS', 'gandus', NULL, NULL],
            ['13.03', '13', 'KERAMASAN', 'keramasan', NULL, NULL],
            ['13.04', '13', 'KERTAPATI', 'kertapati', NULL, NULL],
            ['14.01', '14', 'PLAJU ULU', 'plaju-ulu', NULL, NULL],
            ['14.02', '14', 'PLAJU DARAT', 'plaju-darat', NULL, NULL],
            ['14.03', '14', 'PLAJU ILIR', 'plaju-ilir', NULL, NULL],
            ['14.05', '14', 'KOMPERTA', 'komperta', NULL, NULL],
            ['15.01', '15', 'ALANG-ALANG LEBAR', 'alang-alang-lebar', NULL, NULL],
            ['15.02', '15', 'SRIJAYA', 'srijaya', NULL, NULL],
            ['16.01', '16', 'SRIMULYA', 'srimulya', NULL, NULL],
            ['16.02', '16', 'SUKAMULYA', 'sukamulya', NULL, NULL],
            ['17.01', '17', 'DELAPAN ULU', 'delapan-ulu', NULL, NULL],
            ['17.02', '17', 'SEMBILAN SEPULUH ULU', 'sembilan-sepuluh-ulu', NULL, NULL],
            ['17.04', '17', 'SILABERANTI', 'silaberanti', NULL, NULL],
            ['18.01', '18', 'DELAPAN ILIR', 'delapan-ilir', NULL, NULL],
            ['18.02', '18', 'SEMBILAN ILIR', 'sembilan-ilir', NULL, NULL],
            ['18.03', '18', 'SEPULUH ILIR', 'sepuluh-ilir', NULL, NULL],
            ['18.04', '18', 'SEBELAS ILIR', 'sebelas-ilir', NULL, NULL],
            ['18.06', '18', 'DUKU', 'duku', NULL, NULL],
            ['02.01', '02', 'SATU ULU', 'satu-ulu', NULL, NULL],
            ['02.02', '02', 'DUA ULU', 'dua-ulu', NULL, NULL],
            ['02.03', '02', 'TIGA EMPAT ULU', 'tiga-empat-ulu', NULL, NULL],
            ['02.04', '02', 'LIMA ULU', 'lima-ulu', NULL, NULL],
            ['02.05', '02', 'TUJUH ULU', 'tujuh-ulu', NULL, NULL],
            ['06.01', '06', 'LIMA ILIR', 'lima-ilir', NULL, NULL],
            ['06.02', '06', 'TIGA ILIR', 'tiga-ilir', NULL, NULL],
            ['06.03', '06', 'SATU ILIR', 'satu-ilir', NULL, NULL],
            ['06.04', '06', 'DUA ILIR', 'dua-ilir', NULL, NULL],
            ['10.01', '10', 'BUKIT SANGKAL', 'bukitsangkal', NULL, NULL],
            ['04.06', '04', 'BUKIT BARU', 'bukitbaru', NULL, NULL],
            ['04.01', '04', 'BUKIT LAMA', 'bukitlama', NULL, NULL],
            ['04.02', '04', 'LOROK PAKJO', 'lorokpakjo', NULL, NULL],
            ['03.06', '03', 'TANGGA TAKAT', 'tanggatakat', NULL, NULL],
            ['04.05', '04', 'DEMANG LEBAR DAUN', 'demang-lebardaun', NULL, NULL],
            ['10.03', '10', 'SUNGAI SELAYUR', 'sungaiselayur', NULL, NULL],
            ['10.04', '10', 'SUNGAI SELINCAH', 'sungaiselincah', NULL, NULL],
            ['10.05', '10', 'SUNGAI LAIS', 'sungailais', NULL, NULL],
            ['09.06', '09', 'TALANG AMAN', 'talangaman', NULL, NULL],
            ['12.04', '12', 'KARANG JAYA', 'karangjaya', NULL, NULL],
            ['12.02', '12', 'KARANG ANYAR', 'karanganyar', NULL, NULL],
            ['18.05', '18', 'KUTO BATU', 'kutobatu', NULL, NULL],
            ['17.05', '17', 'TUAN KENTANG', 'tuankentang', NULL, NULL],
            ['16.05', '16', 'KARYA MULIA', 'karyamulia', NULL, NULL],
            ['15.04', '15', 'KARYA BARU', 'karyabaru', NULL, NULL],
            ['14.06', '14', 'TALANG PUTRI', 'talangputri', NULL, NULL],
            ['14.07', '14', 'TALANG BUBUK', 'talangbubuk', NULL, NULL],
            ['14.04', '14', 'BAGUS KUNING', 'baguskuning', NULL, NULL],
            ['13.05', '13', 'KARYA JAYA', 'karyajaya', NULL, NULL],
            ['13.02', '13', 'KEMANG AGUNG', 'kemangagung', NULL, NULL],
            ['13.01', '13', 'KEMAS RINDO', 'kemasrindo', NULL, NULL],
            ['12.05', '12', 'PULO KERTO', 'pulokerto', NULL, NULL],
            ['06.06', '06', 'SUNGAI BUAH', 'sungaibuah', NULL, NULL],
            ['06.05', '06', 'LAWANG KIDUL', 'lawangkidul', NULL, NULL],
            ['05.11', '05', 'KEPANDEAN BARU', 'kepandean-baru', NULL, NULL],
            ['01.01', '01', 'TIGA PULUH LIMA ILIR', 'tiga-puluh-lima-ilir', NULL, NULL],
            ['01.02', '01', 'TIGA PULUH DUA ILIR', 'tiga-puluh-dua-ilir', NULL, NULL],
            ['01.03', '01', 'TIGA PULUH ILIR', 'tiga-puluh-ilir', NULL, NULL],
            ['01.04', '01', 'DUA PULUH SEMBILAN ILIR', 'dua-puluh-sembilan-ilir', NULL, NULL],
            ['01.07', '01', 'KEMANG MANIS', 'kemangmanis', NULL, NULL],
            ['03.02', '03', 'DUA BELAS ULU', 'dua-belas-ulu', NULL, NULL],
            ['03.03', '03', 'TIGA BELAS ULU', 'tiga-belas-ulu', NULL, NULL],
            ['03.04', '03', 'EMPAT BELAS ULU', 'empat-belas-ulu', NULL, NULL],
            ['03.05', '03', 'ENAM BELAS ULU', 'enam-belas-ulu', NULL, NULL],
            ['01.06', '01', 'DUA PULUH TUJUH ILIR', 'dua-puluh-tujuh-ilir', NULL, NULL],
            ['01.05', '01', 'DUA PULUH DELAPAN ILIR', 'dua-puluh-delapan-ilir', NULL, NULL],
            ['04.03', '04', 'DUA PULUH ENAM ILIR SATU', 'dua-puluh-enam-ilir-satu', NULL, NULL],
            ['05.01', '05', 'DELAPAN BELAS ILIR', 'delapan-belas-ilir', NULL, NULL],
            ['05.03', '05', 'TIGA BELAS ILIR', 'tiga-belas-ilir', NULL, NULL],
            ['05.02', '05', 'ENAM BELAS ILIR', 'enam-belas-ilir', NULL, NULL],
            ['05.04', '05', 'EMPAT BELAS ILIR', 'empat-belas-ilir', NULL, NULL],
            ['05.05', '05', 'LIMA BELAS ILIR', 'lima-belas-ilir', NULL, NULL],
            ['05.06', '05', 'TUJUH BELAS ILIR', 'tujuh-belas-ilir', NULL, NULL],
            ['11.02', '11', 'DUA PULUH DUA ILIR', 'dua-puluh-dua-ilir', NULL, NULL],
            ['11.03', '11', 'DUA PULUH TIGA ILIR', 'dua-puluh-tiga-ilir', NULL, NULL],
            ['11.05', '11', 'DUA PULUH ENAM ILIR', 'dua-puluh-enam-ilir', NULL, NULL],
            ['11.04', '11', 'DUA PULUH EMPAT ILIR', 'dua-puluh-empat-ilir', NULL, NULL],
            ['12.03', '12', 'TIGA PULUH ENAM ILIR', 'tiga-puluh-enam-ilir', NULL, NULL],
            ['17.03', '17', 'LIMA BELAS ULU', 'lima-belas-ulu', NULL, NULL],
            ['16.03', '16', 'LEBUNG GAJAH', 'lebung-gajah', NULL, NULL],
            ['15.03', '15', 'TALANG KELAPA', 'talangkelapa', NULL, NULL],
            ['09.05', '09', 'PIPA REJA', 'pipareja', NULL, NULL],
            ['09.03', '09', 'SEKIP JAYA', 'sekipjaya', NULL, NULL],
            ['09.01', '09', 'DUA PULUH ILIR DUA', 'dua-puluh-ilir-dua', NULL, NULL],
            ['05.07', '05', 'DUA PULUH ILIR TIGA', 'dua-puluh-ilir-tiga', NULL, NULL],
            ['05.09', '05', 'DUA PULUH ILIR D SATU', 'dua-puluh-ilir-d-satu', NULL, NULL],
            ['04.04', '04', 'SIRING AGUNG', 'siringagung', NULL, NULL],
            ['13.06', '13', 'OGAN BARU', 'oganbaru', NULL, NULL],
            ['11.01', '11', 'SEMBILAN BELAS ILIR', 'sembilan-belas-ilir', NULL, NULL],
            ['05.08', '05', 'DUA PULUH ILIR D EMPAT', 'dua-puluh-ilir-empat', NULL, NULL],
            ['05.10', '05', 'SUNGAI PANGERAN', 'sungaipangeran', NULL, NULL],
            ['11.06', '11', 'TALANG SEMUT', 'talangsemut', NULL, NULL],
            ['07.02', '07', 'SUKAJAYA', 'sukajaya', NULL, NULL],
            ['07.03', '07', 'SUKARAMI', 'sukarami', NULL, NULL],
            ['07.05', '07', 'SUKABANGUN', 'sukabangun', NULL, NULL],
            ['07.07', '07', 'SUKODADI', 'sukodadi', NULL, NULL],
            ['08.03', '08', 'SIALANG', 'sialang', NULL, NULL],
            ['11.07', '11', 'Bukit Besar cubo bae', 'bukit-besar-cubo-bae', NULL, NULL],
            ['08.04', '08', 'SAKO BARU', 'sakobaru', NULL, NULL],
            ['07.06', '07', 'TALANG JAMBE', 'talangjambe', NULL, NULL],
            ['07.04', '07', 'KEBUN BUNGA', 'kebunbunga', NULL, NULL],
            ['07.01', '07', 'TALANG BETUTU', 'talangbetutu', NULL, NULL],
        ];

        $records = array_map(function ($row) use ($fields) {
            $data = array_combine($fields, $row);
            $data['created_at'] = Carbon::parse($data['created_at'])->utc();
            $data['updated_at'] = Carbon::parse($data['updated_at'])->utc();
            return $data;
        }, $data);

        DB::table('kelurahan')->insert($records);
    }
}
