<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        .header,
        .lampiran,
        .lokasi {
            width: 100%;
            border-collapse: collapse;
        }

        .lampiran th,
        .lampiran td {
            border: 1px solid black;
            padding: 4px;
        }

        .header .left {
            text-align: center;
            width: 50%;
            vertical-align: top;
        }

        .judul-container {
            width: 50%;
            vertical-align: top;
            text-align: left;
            padding-left: 10px;
        }

        .lokasi tr td {
            width: 50%;
        }
    </style>
</head>

<body>
    <table class="header">
        <tr>
            <td class="left">
                <img src="{{ public_path('/img/logo_palembang.png') }}" alt="logo"
                    style="max-width: 130px; margin: 0 auto;">
                <br>
                <span style="font-weight: bold; font-size: 20px;">
                    PEMERINTAH KOTA PALEMBANG<br>
                    DINAS LINGKUNGAN HIDUP
                </span>
                <br>
                <span style="font-size: 14px;">
                    JALAN SUKARELA No.129 A KM 7 TELP (0711) 415130<br>
                    PALEMBANG
                </span>
            </td>
            <td class="judul-container">
                <h2 style="margin-top: 0; text-align: center;">
                    Surat Pemberitahuan Ketetapan Retribusi Daerah<br>
                    (Aneka Retribusi Kebersihan)
                </h2>
                <span style="font-size: 17px;">Dasar:</span><br>
                <div style="padding-left: 40px; font-size: 17px; line-height: 1.4em;">Peraturan Daerah Kota Palembang
                    No. 27 Tahun 2011<br>Surat keputusan kepala DLHK Kota Palembang<br>No : <br>Tanggal/Tahun:
                    <br>Tentang: Surat Ketetapan Retribusi Daerah Tahun 2023<br>(Aneka Retribusi Kebersihan)
                </div><br>
                <p style="font-size: 17px; text-align: center; margin: 0;">Lampiran:</p>
            </td>
        </tr>
    </table>
    <table class="lampiran" style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 12px;">
        <thead>
            <tr>
                <th colspan="3" style="text-align: center; border: 1px solid black; padding: 4px;">
                    Letak Wajib Retribusi
                </th>
                <th colspan="2" style="text-align: center; border: 1px solid black; padding: 4px;">
                    Nama dan Alamat Wajib Retribusi Kebersihan
                </th>
            </tr>
            <tr>
                <td colspan="3" style="height: 100px; text-align: left; vertical-align: middle;">
                    Kecamatan: {{ $data->kecamatanObjekRetribusi }}<br>
                    Kelurahan: {{ $data->kelurahanObjekRetribusi }}
                </td>
                <td colspan="2" style="border: 1px solid black; padding: 4px;"></td>
            </tr>
            <tr>
                <th style="text-align: center; border: 1px solid black; padding: 4px;">No. Reg</th>
                <th style="text-align: center; border: 1px solid black; padding: 4px;">Objek Retribusi</th>
                <th style="text-align: center; border: 1px solid black; padding: 4px;">Kelas</th>
                <th style="text-align: center; border: 1px solid black; padding: 4px;">Tarif / Bulan</th>
                <th style="text-align: center; border: 1px solid black; padding: 4px;">Tarif / Tahun</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="3" style="border: 1px solid black; padding: 4px;">Objek Retribusi yang harus
                    dibayar/bulan: {{ $data->tarifPerBulanObjekRetribusi }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px;">
                    Terbilang:<br>
                    {{ $data->terbilangBulan }}
                </td>
            </tr>
            <tr>
                <td colspan="3" style="border: 1px solid black; padding: 4px;">Objek Retribusi yang harus
                    dibayar/tahun: {{ $data->tarifPerTahunObjekRetribusi}}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px;">
                    Terbilang:<br>
                    {{ $data->terbilangTahun }}
                </td>
            </tr>
        </tbody>
    </table>
    <table class="lokasi" style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr>
            <td style="font-weight: 500; font-size: 16px; text-align: center;">SKET LOKASI</td>
            <td style=""></td>
        </tr>
        <tr>
            <td>
                <iframe
                name="maps"
                src="//maps.google.com/maps?q={{ $data->latitudeObjekRetribusi}},{{$data->longitudeObjekRetribusi}}&z=15&output=embed&z=18"
                width="450"
                height="300"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </td>
            <td></td>
            
        </tr>
    </table>

</body>

</html>
