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
                <img src="{{ public_path('/img/logo_palembang.webp') }}" alt="logo"
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
                    No. 27 Tahun 2011<br>Surat keputusan kepala DLHK Kota Palembang<br>No : {{ $skrd->noSkrd ?? '-' }}
                    <br>Tanggal/Tahun: {{ \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y') }}
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
                    Kecamatan: {{ $data->kecamatan->namaKecamatan }}<br />
                    Kelurahan: {{ $data->kelurahan->namaKelurahan }}
                </td>
                <td colspan="2" style="height: 100px; width: 50%; border: 1px solid black; padding: 4px;">
                    Nama Objek Retribusi: {{ $data->namaObjekRetribusi }}<br />
                    Alamat Objek Retribusi: {{ $data->alamat }}
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
                    dibayar/bulan: <br /> Rp {{ number_format($data->tarifPerbulan, 2, ',', '.') }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px; width: 50%;">
                    Terbilang:<br />
                    <span style="text-transform: uppercase;">{{ terbilang($data->tarifPerbulan) }} rupiah</span>
                </td>
            </tr>
            <tr style="font-size: 14px;">
                <td colspan="3" style="border: 1px solid black; padding: 4px; width: 50%;">Objek Retribusi yang harus
                    dibayar/tahun: <br />Rp
                    {{ $data->tarifPertahun ? number_format($data->tarifPertahun, 2, ',', '.') : '-' }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px; width: 50%;">
                    Terbilang:<br>
                    <span style="text-transform: uppercase;">{{ terbilang($data->tarifPertahun) }} rupiah</span>
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
                <a href="https://www.google.com/maps?q={{ $data->latitude }},{{ $data->longitude }}"
                    style="width: 99%; border: 0.5px solid black; padding: 1px; display: inline-block;">
                    <img style="width: 100%;" width="200"
                        src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:{{ $data->longitude }},{{ $data->latitude }}&zoom=16.6&marker=lonlat:{{ $data->longitude }},{{ $data->latitude }};color:%23ff0000;size:42|lonlat:{{ $data->longitude }},{{ $data->latitude }};color:%23ff0000;size:42&scaleFactor=2&apiKey=2f7cdfd496b94f42ab1d242b7e969a69"
                        alt="Palembang, South Sumatra, Indonesia" />
                </a>
            </td>
            <td style="width: 50%; text-align: center;">
                {{-- <p style="font-size: 14px; line-height: 0.8rem; width: max-content; margin: 0 auto 110px;">An. Kepala
                    Dinas
                    Lingkungan
                    Hidup<br />Kota Palembang<br />
                    Kepala Bidang Pengelolaan Sampan dan Limbah B3</p>
                <p
                    style="font-size: 14px; line-height: 0.8rem; text-align: left; display: inline-block; margin: 0 auto; width: 230px;">
                    {{ $kabid->namaLengkap }}
                    <br />NIP
                </p> --}}
                <p style="font-size: 14px; line-height: 0.8rem; width: max-content; margin: 0 auto 110px;">
                    {{ $tandaTangan->jabatan1 }}<br />{{ $tandaTangan->kota }}<br />
                    {{ $tandaTangan->jabatan2 }}</p>
                <p
                    style="font-size: 14px; line-height: 0.8rem; text-align: left; display: inline-block; margin: 0 auto; width: 230px;">
                    {{ $tandaTangan->nama }}
                    <br />NIP {{ $tandaTangan->nip }}
                </p>
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
                <td style="width: 25%; vertical-align: top;">No. SKRD</td>
                <td style="width: 25%;">: {{ $skrd->noSkrd ?? '-' }}</td>
                <td style="width: 25%; padding-left: 10px;">Diterima Tanggal</td>
                <td style="width: 25%;">: -</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">No. Wajib Retribusi</td>
                <td>: {{ $data->noWajibRetribusi ?? '-' }}</td>
                <td style="padding-left: 10px;">Nama Penerima</td>
                <td>: -</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Nama Wajib Retribusi</td>
                <td style="padding-right: 20px;">
                    <div style="display: table;">
                        <div style="display: table-row; background: red;">
                            <div style="display: table-cell;">:</div>
                            <div style="display: table-cell; padding-left: 4px;">
                                {{ $data->namaObjekRetribusi }}
                            </div>
                        </div>
                    </div>
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Tarif Ketetapan / Bulan</td>
                <td>: Rp {{ number_format($data->tarifPerbulan, 2, ',', '.') }}</td>
                <td style="text-align: center;">Penerima</td>
                <td style="text-align: center;">Penagih</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Tarif Ketetapan / Tahun</td>
                <td>: Rp {{ number_format($data->tarifPertahun, 2, ',', '.') }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Jumlah Bulan</td>
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
                                {{ $data->alamat }} KELURAHAN {{ $data->kelurahan->namaKelurahan }}
                                KECAMATAN {{ $data->kecamatan->namaKecamatan }}
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
                <td style="text-align: center;">{{ $data->pemilik->namaPemilik }}</td>
                <td style="text-align: center;">{{ $data->user->namaLengkap }}</td>
            </tr>
        </table>
    </div>

    <div
        style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            transform-origin: center;
            font-size: 10rem;
            font-weight: bold;
            color: black;
            opacity: 0.25;
            white-space: nowrap;
            letter-spacing: 20px;
            z-index: 2;
            pointer-events: none;
            ">
        DRAFT</div>

</body>

</html>
