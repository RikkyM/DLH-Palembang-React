<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            'id',
            'namaLengkap',
            'username',
            'role',
            'jabatan',
            'nip',
            'email',
            'password',
            'created_at',
            'updated_at',
            'kelamin',
            'pangkat',
            'golongan',
            'deskripsi',
            'lokasi',
            'uptdId',
            'historyLogin'
        ];

        $data = [
            [47, 'Aufa Haqqu Hablillah,S.T', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Ilir Barat 2', '199506202019021002', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-05 10:02:20.985+07', 'Laki-laki', '-', '-', '-', 'ILIR BARAT DUA', 3, '2024-02-05 10:02:20.983+07'],
            [242, 'Adi Wijaya, S.E', 'adiwijayakasubag', 'ROLE_KASUBAG_TU_UPDT', 'Kepala UPTD Bukit Kecil', '1977062720011210012', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 13:32:57.162+07', 'Laki-laki', '-', '-', '-', 'BUKIT KECIL', 13, '2024-01-24 13:32:57.161+07'],
            [123, 'Ayuni Chotimah', "aycot", 'ROLE_PENDAFTAR', 'Staf', '013', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'BUKIT KECIL', 13, '2023-12-28 16:26:57.343+07'],
            [122, 'Vina Angguningtyas', "vinul", 'ROLE_PENDAFTAR', 'Staf', '017', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ALANG-ALANG LEBAR', 17, '2023-12-28 16:26:57.343+07'],
            [133, 'Vina Angguningtyas', null, 'ROLE_PENDAFTAR', 'Staf', '011', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'KEMUNING', 11, '2023-12-28 16:26:57.343+07'],
            [130, 'Vina Angguningtyas', null, 'ROLE_PENDAFTAR', 'Staf', '019', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'JAKABARING', 19, '2023-12-28 16:26:57.343+07'],
            [44, 'Dwi Maharani, S.T, M.M', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Plaju', '198503182011012011', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-06 09:02:19.632+07', 'Perempuan', '-', '-', '-', 'PLAJU', 16, '2024-03-06 09:02:19.63+07'],
            [134, 'Rany Nopiani', "opet", 'ROLE_PENDAFTAR', 'Staf', '015', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'KERTAPATI', 15, '2023-12-28 16:26:57.343+07'],
            [124, 'Putri Pertiwi', 'putripertiwi', 'ROLE_PENDAFTAR', 'Staf', '014', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'GANDUS', 14, '2023-12-28 16:26:57.343+07'],
            [136, 'Putri Pertiwi', null, 'ROLE_PENDAFTAR', 'Staf', '016', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'PLAJU', 16, '2023-12-28 16:26:57.343+07'],
            [51, 'Efrianto, S.T', null, 'ROLE_KUPTD', 'Kepala UPTD Gandus', '198003292009021001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:43:23.162+07', 'Laki-laki', '-', '-', '-', 'GANDUS', 14, '2024-01-24 14:43:23.161+07'],
            [57, 'Birmansyah, SKM.,M.Si', null, 'ROLE_KUPTD', 'Kepala UPTD Sukarami', '197307211993031001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 13:13:31.092+07', 'Laki-laki', '-', '-', '-', 'SUKARAMI', 9, '2023-12-28 13:13:31.091+07'],
            [241, 'Iwan Kurniawan,S.H', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag UPTD Semabor', '00016', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-26 12:59:13.782+07', 'Laki-laki', '-', '-', '-', 'SEMATANG BORANG', 18, '2024-03-26 12:59:13.781+07'],
            [138, 'Putri Pertiwi', null, 'ROLE_PENDAFTAR', 'Staf', '005', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'SEBERANG ULU DUA', 5, '2023-12-28 16:26:57.343+07'],
            [1, 'Katim DLH Palembang', null, 'ROLE_KATIM', 'Dinas DLH', '25052022', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 13:01:24.393+07', '-', '-', '-', '-', 'KALIDONI', 1, '2023-12-28 13:01:24.392+07'],
            [137, 'Rany Nopiani', null, 'ROLE_PENDAFTAR', 'Staf', '010', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'SAKO', 10, '2023-12-28 16:26:57.343+07'],
            [127, 'Putri Pertiwi', null, 'ROLE_PENDAFTAR', 'Staf', '008', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ILIR TIMUR DUA', 8, '2023-12-28 16:26:57.343+07'],
            [240, 'Kasubbag TU UPTD IT1', null, 'ROLE_KASUBAG_TU_UPDT', 'KasubbagTU UPTD Ilir Timur 1', '00007', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:38:27.61+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR SATU', 7, '2024-01-24 14:38:27.609+07'],
            [128, 'Anggun Lestari', "anggunan", 'ROLE_PENDAFTAR', 'Staf', '007', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ILIR TIMUR SATU', 7, '2023-12-28 16:26:57.343+07'],
            [126, 'Rany Nopiani', null, 'ROLE_PENDAFTAR', 'Staf', '006', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ILIR BARAT SATU', 6, '2023-12-28 16:26:57.343+07'],
            [125, 'Anggun Lestari', null, 'ROLE_PENDAFTAR', 'Staf', '003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ILIR BARAT DUA', 3, '2023-12-28 16:26:57.343+07'],
            [132, 'Berto Testing', null, 'ROLE_PENDAFTAR', 'Nap', '0909', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'KALIDONI', 12, '2023-12-28 16:26:57.343+07'],
            [62, 'Rendy Kurniawan Saputra, S.Kom., M.Si', null, 'ROLE_KUPTD', 'Kepala UPTD Kalidoni', '198809092010011001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-12 18:21:59.043+07', 'Laki-laki', '-', '-', '-', 'KALIDONI', 12, '2024-01-12 18:21:59.038+07'],
            [48, 'Wafrotun, ST', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Sako', '197904072011011003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 13:14:33.879+07', 'Laki-laki', '-', '-', '-', 'SAKO', 10, '2023-12-28 13:14:33.878+07'],
            [144, 'Ayuni Chotimah', null, 'ROLE_PENDAFTAR', 'Staf', '012', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'KALIDONI', 12, '2023-12-28 16:26:57.343+07'],
            [238, 'Superadmin', 'superadmin', 'ROLE_SUPERADMIN', '-', '090988', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-09 20:54:48.231+07', '-', '-', '-', '-', 'DINAS', 1, '2024-01-09 20:54:48.23+07'],
            [39, 'Muhammad Ishaq Hariyadi, S.T', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Ilir Timur 3', '197803232010011011', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-20 09:03:53.455+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR TIGA', 20, '2024-02-20 09:03:53.454+07'],
            [40, 'Damaiyanti, SE., M.Si', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Kemuning', '197909062010012015', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-28 11:03:43.697+07', 'Perempuan', '-', '-', '-', 'KEMUNING', 11, '2024-01-28 11:03:43.696+07'],
            [36, 'Lusi Oktarina, S.Sos.', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD AAL', '197801081999032003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-22 11:34:24.913+07', 'Laki-laki', '-', '-', '-', 'ALANG-ALANG LEBAR', 17, '2024-02-22 11:34:24.911+07'],
            [37, 'Nuryadi, S.Sos', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Gandus', '197210302014071002', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:45:06.557+07', 'Laki-laki', '-', '-', '-', 'GANDUS', 14, '2024-01-24 14:45:06.556+07'],
            [38, 'Erryn Prameswari, S.IP', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Ilir Barat 1', '198801232010012002', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:48:34.46+07', 'Perempuan', '-', '-', '-', 'ILIR BARAT SATU', 6, '2024-01-24 11:48:34.459+07'],
            [34, 'Dirhandi, S.T', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD SU 2', '197807022014071001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-04 10:26:12.85+07', 'Laki-laki', '-', '-', '-', 'SEBERANG ULU DUA', 5, '2024-03-04 10:26:12.85+07'],
            [52, 'Yefy Afrizal, S.H., M.H', null, 'ROLE_KUPTD', 'Kepala UPTD Ilir Timur 1', '198204012010011021', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:38:27.61+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR SATU', 7, '2024-01-24 14:38:27.609+07'],
            [35, 'Mutiara Crasandra, S.KM, M.Kes', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD TPA', '198911192011012005', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 12:48:57.248886+07', 'Perempuan', '-', '-', '-', 'DINAS', 1, NULL],
            [239, 'Ayuni Chotimah', null, 'ROLE_PENDAFTAR', 'Staf', '020', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'ILIR TIMUR TIGA', 20, '2023-12-28 16:26:57.343+07'],
            [41, 'Halimin, S.Sos', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Jakabaring', '196904242014071001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-22 11:52:59.17+07', 'Laki-laki', '-', '-', '-', 'JAKABARING', 19, '2024-02-22 11:52:59.168+07'],
            [64, 'Hasnul Yakin, S.Ag., M.Si', null, 'ROLE_KUPTD', 'Plt. Kepala UPTD', '196710282014071001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-30 10:08:37.946+07', 'Laki-laki', '-', '-', '-', 'SEBERANG ULU DUA', 5, '2024-01-30 10:08:37.944+07'],
            [59, 'Raden Akhmad Sjarifudin, S.Kom', null, 'ROLE_KUPTD', 'Kepala UPTD SU 1', '197012151996031004', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-02 09:45:11.669+07', 'Laki-laki', '-', '-', '-', 'SEBERANG ULU SATU', 4, '2024-02-02 09:45:11.666+07'],
            [65, 'Robby Zulkarnaen,S.E', null, 'ROLE_KUPTD', 'Kepala UPTD Ilir Timur 2', '198006212010011024', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-04 20:46:00.134+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR DUA', 8, '2024-02-04 20:46:00.133+07'],
            [68, 'Ferry Gustiawan, S.Kom', null, 'ROLE_KUPTD', 'Kepala UPTD Jakabaring', '197808042010011006', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-29 15:08:05.664+07', 'Laki-laki', '-', '-', '-', 'JAKABARING', 19, '2024-01-29 15:08:05.663+07'],
            [66, 'Iswono, S.STP', null, 'ROLE_KUPTD', 'Kepala UPTD Ilir Timur 3', '198004021999121001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-05 14:11:26.641+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR TIGA', 20, '2024-02-05 14:11:26.64+07'],
            [69, 'Arnaldo, S.T', null, 'ROLE_KUPTD', 'Kepala UPTD Kertapati', '198001152009031001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-06 08:15:06.956+07', 'Laki-laki', '-', '-', '-', 'KERTAPATI', 15, '2024-02-06 08:15:06.955+07'],
            [60, 'Musiana, S.E., M.M.', null, 'ROLE_KUPTD', 'Kepala UPTD Plaju', '197509201994022001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:40:44.761+07', 'Perempuan', '-', '-', '-', 'PLAJU', 16, '2024-01-24 14:40:44.76+07'],
            [42, 'Yossi Prima Oktavia, S.I.P', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Kalidoni', '198110022007012013', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-18 10:53:37.113+07', 'Perempuan', '-', '-', '-', 'KALIDONI', 12, '2024-03-18 10:53:37.111+07'],
            [49, 'Fogi Chandra Permana Putra, S.Kom', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Ilir Timur 2', '198605122019021002', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-06 23:46:50.323+07', 'Laki-laki', '-', '-', '-', 'ILIR TIMUR DUA', 8, '2024-02-06 23:46:50.321+07'],
            [74, 'Ela Darmanis, S.T., M.Si', null, 'ROLE_BENDAHARA', 'Bendahara', '197602102014072002', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 12:48:57.248886+07', 'Perempuan', '-', '-', '-', 'DINAS', 1, NULL],
            [77, 'Jessie Zarastami, S.E., M.Si', null, 'ROLE_KATIM', 'Ketua Tim PSLB3', '198704262010012008', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:44:59.972+07', 'Perempuan', '-', '-', '-', 'DINAS', 1, '2024-01-24 11:44:59.971+07'],
            [73, 'Ratih Syafiatuddin, A.Md.', null, 'ROLE_BENDAHARA', 'Bendahara', '198805302010012004', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-11 18:33:08.136+07', 'Perempuan', '-', '-', '-', 'DINAS', 1, '2024-03-11 18:33:08.136+07'],
            [46, 'Sri Herawati, S.IP', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Sukarami', '198108302010012009', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-03-01 14:13:05.081+07', 'Perempuan', '-', '-', '-', 'SUKARAMI', 9, '2024-03-01 14:13:05.077+07'],
            [55, 'Zaidan Jauhari, S.Sos., M.Si', null, 'ROLE_KUPTD', 'Kepala UPTD TPA', '197006061993031006', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 12:48:57.248886+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, NULL],
            [56, 'Dr. Zama Kurniati Martina W, S.H., M.H, CLA', null, 'ROLE_KUPTD', 'Kepala UPTD AAL', '198103132010012010', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-15 14:19:33.615+07', 'Perempuan', '-', '-', '-', 'ALANG-ALANG LEBAR', 17, '2024-02-15 14:19:33.614+07'],
            [58, 'Jafri Hidayat, S.E', null, 'ROLE_KUPTD', 'Kepala UPTD Kemuning', '19780106200701020', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 12:51:50.627+07', 'Laki-laki', '-', '-', '-', 'KEMUNING', 11, '2024-01-24 12:51:50.625+07'],
            [45, 'Andry Alex Aquardus,S.T', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD SU 1', '197602062010011012', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-26 15:10:41.135+07', 'Laki-laki', '-', '-', '-', 'SEBERANG ULU SATU', 4, '2024-02-26 15:10:41.133+07'],
            [50, 'Nazirin, S.T.', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Laboratorium', '198304112009031003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 12:48:57.248886+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, NULL],
            [43, 'Muhammad Eko Pratama,S.H', null, 'ROLE_KASUBAG_TU_UPDT', 'Kasubbag TU UPTD Kertapati', '198501052008011001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-05-02 08:17:24.908+07', 'Laki-laki', '-', '-', '-', 'KERTAPATI', 15, '2024-05-02 08:17:24.907+07'],
            [53, 'Ariz Agustian, ST', null, 'ROLE_KUPTD', 'Kepala UPTD Ilir Barat 2', '198208022009031001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 14:35:28.775+07', 'Laki-laki', '-', '-', '-', 'ILIR BARAT DUA', 3, '2024-01-24 14:35:28.774+07'],
            [54, 'Jajang Hadi, SE, M.Si', null, 'ROLE_KUPTD', 'Kepala UPTD Sako', '197805282009011006', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 15:45:18.013+07', 'Laki-laki', '-', '-', '-', 'SAKO', 10, '2024-01-24 15:45:18.013+07'],
            [63, 'Iwan Kurniawan,S.H', null, 'ROLE_KUPTD', 'Plt. Kepala UPTD Semabor', '198212042011011003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-02-15 08:28:17.781+07', 'Laki-laki', '-', '-', '-', 'SEMATANG BORANG', 18, '2024-02-15 08:28:17.78+07'],
            [72, 'Lusiana, S.Si., M.Si', null, 'ROLE_BENDAHARA', 'Bendahara', '197507292014072001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:54:44.664+07', 'Perempuan', '-', '-', '-', 'DINAS', 1, '2024-01-24 11:54:44.663+07'],
            [78, 'Ardiansah, S.Sos., M.Si', null, 'ROLE_KATIM', 'Ketua Tim PSLB3', '198103232009011011', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-29 12:25:45.131+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, '2024-01-29 12:25:45.128+07'],
            [61, 'Adi Wijaya, S.E', 'adiwijayakuptd', 'ROLE_KUPTD', 'Kepala UPTD Bukit Kecil', '197706272001121001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 13:32:57.162+07', 'Laki-laki', '-', '-', '-', 'BUKIT KECIL', 13, '2024-01-24 13:32:57.161+07'],
            [67, 'M. Syahid Mubarok, S.Kom', null, 'ROLE_KUPTD', 'Kepala UPTD Ilir Barat 1', '198206222010011005', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:26:35.64+07', 'Laki-laki', '-', '-', '-', 'ILIR BARAT SATU', 6, '2024-01-24 11:26:35.639+07'],
            [76, 'Indar Tri Setiantoro, ST., M.Si', null, 'ROLE_KATIM', 'Ketua Tim PSLB3', '197504182000031003', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 12:48:57.248886+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, NULL],
            [71, 'Aris Satria Bandarnata, S.STP., M.Si', null, 'ROLE_SEKDIN', 'Sekretaris Dinas Lingkungan Hidup', '198110022001121001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:46:40.024+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, '2024-01-24 11:46:40.023+07'],
            [143, 'SUPERADMIN', null, 'ROLE_PENDAFTAR', 'Staf', '19880909', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'DINAS', 1, '2023-12-28 16:26:57.343+07'],
            [70, 'Dr. H. Akhmad Mustain, S.STP., M.Si', null, 'ROLE_KADIN', 'Kepala Dinas Lingkungan Hidup', '198106281999121001', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 13:14:54.628+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, '2023-12-28 13:14:54.628+07'],
            [75, 'Andika Marta Dinata, ST., MT', null, 'ROLE_KABID', 'Kepala Bidang PSLB3', '198003162003121005', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2024-01-24 11:46:07.459+07', 'Laki-laki', '-', '-', '-', 'DINAS', 1, '2024-01-24 11:46:07.458+07'],
            [139, 'Ayuni Chotimah', null, 'ROLE_PENDAFTAR', 'Staf', '004', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'SEBERANG ULU SATU', 4, '2023-12-28 16:26:57.343+07'],
            [140, 'Anggun Lestari', null, 'ROLE_PENDAFTAR', 'Staf', '018', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'SEMATANG BORANG', 18, '2023-12-28 16:26:57.343+07'],
            [141, 'Anggun Lestari', null, 'ROLE_PENDAFTAR', 'Staf', '009', '-', '$2y$10$Qos.Hey.QN2rieJbtf.SPu6Kx8RNOQnD9t5DkjjdUI2U0.K3Mxgo6', '2023-12-28 12:48:57.248886+07', '2023-12-28 16:26:57.343+07', '-', '-', '-', '-', 'SUKARAMI', 9, '2023-12-28 16:26:57.343+07'],
        ];

        $checkName = array_column(
            array_filter($data, fn($row) => $row[2] !== null),
            1
        );

        $records = array_map(function ($row) use ($fields, $checkName) {
            $data = array_combine($fields, $row);

            if ($data['username'] === null && !in_array($data['namaLengkap'], $checkName)) {
                $cleanName = strtolower(preg_replace('/[.,]/', '', $data['namaLengkap']));
                $parts = explode(' ', $cleanName);
                // $parts = array_slice($parts, 0, 2);
                if (count($parts) <= 2) {
                    $username = $parts[0];
                } else {
                    // $username = implode('', $parts);
                    // $username = array_slice($parts, 0, 2);
                    $username = $parts[0] . $parts[1];
                }

                $data['username'] = $username;
            }

            if ($data['jabatan'] === 'Staf') {
                $data['jabatan'] = 'Petugas Daftar';
            }

            $data['created_at'] = Carbon::parse($data['created_at'])->utc();

            if ($data['updated_at'] && $data['updated_at'] !== '-') {
                $data['updated_at'] = Carbon::parse($data['updated_at'])->utc();
            } else {
                $data['updated_at'] = Carbon::now()->utc();
            }

            if ($data['historyLogin'] && $data['historyLogin'] !== '-') {
                $data['historyLogin'] =
                    json_encode([Carbon::parse($data['historyLogin'])->utc()]);
            } else {
                $data['historyLogin'] = json_encode([]);
            }

            return $data;
        }, $data);

        DB::table('users')->insert($records);
    }
}
