<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <style>
        @font-face {
            font-family: 'ArialCustom';
            font-style: normal;
            font-weight: normal;
            src: url('{{ public_path('fonts/arial/ARIAL.TTF') }}') format('truetype');
        }

        @font-face {
            font-family: 'ArialCustom';
            font-style: normal;
            font-weight: bold;
            src: url('{{ public_path('fonts/arial/ARIALBD.TTF') }}') format('truetype');
        }

        @font-face {
            font-family: 'ArialCustom';
            font-style: italic;
            font-weight: normal;
            src: url('{{ public_path('fonts/arial/ARIALI.TTF') }}') format('truetype');
        }

        @font-face {
            font-family: 'ArialCustom';
            font-style: italic;
            font-weight: bold;
            src: url('{{ public_path('fonts/arial/ARIALBI.TTF') }}') format('truetype');
        }

        * {
            padding: 0;
            box-sizing: border-box;
            font-family: 'ArialCustom';
        }

        body {
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
                    No. 27 Tahun 2011<br>Surat keputusan kepala DLHK Kota Palembang<br>No : {{ $data->noSkrd }}
                    <br>Tanggal/Tahun: {{ now()->format('d M Y') }}
                    <br>Tentang: Surat Ketetapan Retribusi Daerah Tahun 2023<br>(Aneka Retribusi Kebersihan)
                </div><br>
                <p style="font-size: 17px; text-align: center; margin: 0;">Lampiran:</p>
            </td>
        </tr>
    </table>
    <table class="lampiran" style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 12px;">
        <thead>
            <tr style="font-size: 14px;">
                <th colspan="3" style="width: 50%; text-align: center; border: 1px solid black; padding: 4px;">
                    Letak Wajib Retribusi
                </th>
                <th colspan="2" style="width: 50%; text-align: center; border: 1px solid black; padding: 4px;">
                    Nama dan Alamat Wajib Retribusi Kebersihan
                </th>
            </tr>
        </thead>
        <tbody>
            <tr style="font-size: 14px;">
                <td colspan="3" style="height: 100px; width: 50%; text-align: left; vertical-align: middle;">
                    Kecamatan: {{ $data->kecamatanObjekRetribusi }}<br />
                    Kelurahan: {{ $data->kelurahanObjekRetribusi }}
                </td>
                <td colspan="2" style="height: 100px; width: 50%; border: 1px solid black; padding: 4px;">
                    Nama Objek Retribusi: {{ $data->namaObjekRetribusi }}<br />
                    Alamat Objek Retribusi: {{ $data->alamatObjekRetribusi }}
                </td>
            </tr>
            <tr style="font-size: 14px;">
                <td style="width: 16.66%; text-align: center; border: 1px solid black; padding: 4px;">No. Reg</td>
                <td style="width: 16.66%; text-align: center; border: 1px solid black; padding: 4px;">Objek Retribusi
                </td>
                <td style="width: 16.66%; text-align: center; border: 1px solid black; padding: 4px;">Kelas</td>
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">Tarif / Bulan</td>
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">Tarif / Tahun</th>
            </tr>
            <tr style="font-size: 14px;">
                <td colspan="3" style="border: 1px solid black; padding: 4px; width: 50%;">Objek Retribusi yang harus
                    dibayar/bulan: <br /> {{ $data->tarifPerBulanObjekRetribusi }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px; width: 50%;">
                    Terbilang:<br />
                    {{ $data->terbilangBulan }}
                </td>
            </tr>
            <tr style="font-size: 14px;">
                <td colspan="3" style="border: 1px solid black; padding: 4px; width: 50%;">Objek Retribusi yang harus
                    dibayar/tahun: <br /> {{ $data->tarifPerTahunObjekRetribusi }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px; width: 50%;">
                    Terbilang:<br>
                    {{ $data->terbilangTahun }}
                </td>
            </tr>
        </tbody>
    </table>
    <table class="lokasi" style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr>
            <td style="font-weight: 500; font-size: 16px; text-align: center; padding: 5px 0;">SKET LOKASI</td>
            <td style=""></td>
        </tr>
        <tr>
            <td style="width: 50%;">
                <a href="https://www.google.com/maps?q={{ $data->latitudeObjekRetribusi }},{{ $data->longitudeObjekRetribusi }}"
                    style="width: 99%; border: 0.5px solid black; padding: 1px; display: block">
                    <img style="width: 100%;"
                        src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:{{ $data->longitudeObjekRetribusi }},{{ $data->latitudeObjekRetribusi }}&zoom=16.6&marker=lonlat:{{ $data->longitudeObjekRetribusi }},{{ $data->latitudeObjekRetribusi }};color:%23ff0000;size:42|lonlat:{{ $data->longitudeObjekRetribusi }},{{ $data->latitudeObjekRetribusi }};color:%23ff0000;size:42&scaleFactor=2&apiKey=2f7cdfd496b94f42ab1d242b7e969a69"
                        alt="Palembang, South Sumatra, Indonesia">
                </a>
            </td>
            <td style="width: 50%; text-align: center;">
                <p style="font-size: 14px; line-height: 0.8rem; width: max-content; margin: 0 auto 110px;">An. Kepala Dinas
                    Lingkungan
                    Hidup<br />Kota Palembang<br />
                Kepala Bidang Pengelolaan Sampan dan Limbah B3</p>
                {{-- <img src="/img/qrcode.jpg" alt="QR Code DLH Palembang" width="50" height="50" /><br/> --}}
                <p
                    style="font-size: 14px; line-height: 0.8rem; text-align: left; display: inline-block; margin: 0 auto; width: 230px;">
                    {{-- Andika Marta Dinata. S.ST., M.T --}}
                    {{ $kabid->namaLengkap }}
                    <br />NIP</p>
                {{-- <p style="font-size: 7px; max-width: 350px; text-align: left; line-height: 0.45rem; margin: auto;">-UU
                    ITE No. 11 Tahun 2008 Pasal 5 ayat 1 Informasi Elektronik dan/atau
                    Dokumen Elektronik dan/atau
                    hasil
                    cetaknya merupakan alat bukti hukum yang sah. - Dokumen ini telah ditandatangani secara elektronik
                    menggunakan
                    sertifikat elektronik yang diterbitkan BSrE. - Surat ini dapat dibuktikan keasliannya dengan cara
                    memindai QRCode
                    yang terdapat pada lembar ini dengan menggunakan aplikasi Sidemang atau VeryDS, dapat diunduh
                    melalui
                    Playstore/Appstore.
                </p> --}}
            </td>
        </tr>
    </table>
    <table
        style="width: 100%; line-height: 0.6rem; text-align: justify; padding: 10px; border: 1px solid black; margin-top: 20px; font-size: 14px;">
        <tr>
            <td style="width: 2%; vertical-align: top">1.</td>
            <td>Pembayaran/penyetoran retribusi kebersihan dapat dibayar / disetor pada petugas penagih
                retribusi kebersihan yang mendatangi tempat saudara, yang
                dilengkapi dengan surat tugas dan papan nama atau dibayar langsung ke bendahara penerimaan
                di
                kantor DLHK Palembang Jl. Sukarela No, 129 KM 7.
                Telp 415130 kota Palembang</td>
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">2.</td>
            <td>Wajib retribusi yang tidak melaksanakan kewajiaban pembayaran sehingga merugikan keuangan
                daerah diancam dengan pidana kurungan paling lama 3
                (Tiga) bulan dan denda paling banyak 3 (TIga) kali jumlah retribusi yang terhutang (Perda
                No.27
                Tahun 2011)</td>
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">3.</td>
            <td>Penyetoran dan pembayaran retribusi kebersihan dapat juga dilakukan langsung oleh wajib
                retribusi melalui rekening Bank Sumsse Babel Cabang Kolonel
                Atmo dengan nomor rekening 150.30.0000.5 A/n. Pemerintah Kota Palembang, disertai narasi
                "Retribusi Kebersihan" dengan menyertakan nama retribusi
                yang bersangkutan dan tahun yang berkenaan</td>
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">4.</td>
            <td>Apabila penyetoran atau pembayaran retribusi kebersihan dilakukan secara non tunai
                transfer/bilyet giro/kriling maka jika ada biaya administrasi ataupun
                biaya-biaya lainnya sepenuhnya ditanggung oleh wajib retribusi yang bersangkutan</td>
        </tr>
    </table>
    <div style="border-top: 3px dashed !important; margin-top: 1.4rem; padding-top: 1.4rem;">
        <table style="border-collapse: collapse; width: 100%; max-width: 800px;line-height: 0.7rem; font-size: 14px;">
            <tr>
                <td style="width: 25%;">No. SKRD</td>
                <td style="width: 25%;">: {{ $data->noSkrd }}</td>
                <td style="width: 25%; padding-left: 10px;">Diterima Tanggal</td>
                <td style="width: 25%;">: -</td>
            </tr>
            <tr>
                <td>No. Wajib Retribusi</td>
                <td>: {{ $data->noWajibRetribusi }}</td>
                <td style="padding-left: 10px;">Nama Penerima</td>
                <td>: -</td>
            </tr>
            <tr>
                <td>Nama Wajib Retribusi</td>
                <td>: {{ $data->namaObjekRetribusi }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Tarif Ketetapan / Bulan</td>
                <td>: {{ $data->tarifPerBulanObjekRetribusi }}</td>
                <td style="text-align: center;">Penerima</td>
                <td style="text-align: center;">Penagih</td>
            </tr>
            <tr>
                <td>Tarif Ketetapan / Tahun</td>
                <td>: {{ $data->tarifPerTahunObjekRetribusi }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Jumlah Bulan</td>
                <td>: {{ $data->jumlahBulan }} Bulan</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Alamat</td>
                <td style="padding-right: 20px;">
                    <div style="display: table;">
                        <div style="display: table-row; background: red;">
                            <div style="display: table-cell;">:</div>
                            <div style="display: table-cell; padding-left: 4px;">
                                {{ $data->alamatObjekRetribusi }} KELURAHAN {{ $data->kelurahanObjekRetribusi }}
                                KECAMATAN {{ $data->kecamatanObjekRetribusi }}
                            </div>
                        </div>
                    </div>
                </td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td style="text-align: center;">Jhon Doe</td>
                <td style="text-align: center;">Jhon Doe</td>
            </tr>
        </table>
    </div>

</body>

</html>
