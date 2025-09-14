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
            margin-bottom: 10px;
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
    <table class="header" style="margin-bottom: 28px; margin-top: 15px;">
        <tr>
            <td class="left">
                <img src="{{ public_path('/img/logo_palembang.webp') }}" alt="logo"
                    style="max-width: 130px; margin: 0 auto;">
                <br>
                <span style="font-weight: bold; font-size: 24px;">
                    PEMERINTAH KOTA PALEMBANG<br>
                    DINAS LINGKUNGAN HIDUP
                </span>
                <br>
                <span style="font-size: 20px;">
                    JALAN SUKARELA NO 129 A KM 7 TELP (0711) 415130<br>
                    PALEMBANG
                </span>
            </td>
            <td class="judul-container">
                <h2 style="margin-top: 10px; text-align: center; font-size: 20px;">
                    Surat Pemberitahuan Ketetapan Retribusi Daerah<br>
                    Jasa Umum Pelayanan Persampahan/Kebersihan
                </h2>
                {{-- <span style="font-size: 18px;">Dasar:</span> --}}
                {{-- <br> --}}
                <div style="padding-left: 40px; font-size: 18px; line-height: 1.4em; margin-top: 20px;">Peraturan Daerah
                    Kota Palembang
                    No. 4 Tahun 2023<br>Tentang Pajak Daerah dan Retribusi Daerah<br />
                    <table>
                        <tr>
                            <td>Nomor SPKRD</td>
                            <td style="padding: 0 10px;">:</td>
                            <td>{{ $data->noSkrd ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>Tanggal</td>
                            <td style="padding: 0 10px;">:</td>
                            <td>{{ \Carbon\Carbon::parse($data->tanggalSkrd)->locale('id')->translatedFormat('d F Y') }}</td>
                        </tr>
                    </table>
                    {{-- Nomor STRD: {{ $skrd->noSkrd ?? '' }}
                    <br>Tanggal: {{ \Carbon\Carbon::now()->locale('id')->translatedFormat('d/m/Y') }} --}}
                    {{-- <br>Tentang: Surat Ketetapan Retribusi Daerah Tahun 2023<br>(Aneka Retribusi Kebersihan) --}}
                </div><br>
                {{-- <p style="font-size: 18px; text-align: center; margin: 0;">Lampiran:</p> --}}
            </td>
        </tr>
    </table>
    <table class="lampiran" style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 18px;">
        <thead>
            <tr style="font-size: 18px;">
                <th colspan="2" style="width:50%; text-align: center; border: 1px solid black; padding: 4px;">
                    Nama Wajib Retribusi
                </th>
                <th colspan="2" style="width:50%; text-align: center; border: 1px solid black; padding: 4px;">
                    Alamat Wajib Retribusi
                </th>
            </tr>
        </thead>
        <tbody>
            <tr style="font-size: 18px;">
                <td colspan="2"
                    style="height: 100px;  text-align: left; vertical-align: middle; padding-left: 20px;">
                    {{ $data->namaObjekRetribusi }}
                </td>
                <td colspan="2"
                    style="height: 100px;  border: 1px solid black; padding: 4px; text-transform: uppercase; width: 50%; padding-left: 20px;">
                    {{ $data->alamat }}<br />
                    <span>Palembang</span><br />
                    <div style="line-height: 0.4rem; margin-top: 15px;">
                        <span style="display: inline-block;">kelurahan
                            {{ $data->kelurahan->namaKelurahan }}</span><br>
                        <span>kecamatan {{ $data->kecamatan->namaKecamatan }}</span>
                    </div>
                </td>
            </tr>
            <tr style="font-size: 18px; ">
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">No. Wajib Retribusi
                </td>
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">Rincian Layanan
                </td>
                <td style=" text-align: center; padding: 4px; width: 50%;" colspan="2">Detail Rincian Layanan</td>
            </tr>
            <tr style="font-size: 18px; ">
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">
                    {{ $data->noWajibRetribusi ?? '-' }}</td>
                <td style="width: 25%; text-align: center; border: 1px solid black; padding: 4px;">
                    {{ $data->kategori->namaKategori }}
                </td>
                <td style=" text-align: center; padding: 4px; width: 50%;" colspan="2">
                    {{ $data->subKategori->namaSubKategori }}</td>
            </tr>
            <tr style="font-size: 18px;">
                <td colspan="2" style="witdth: 50%; border: 1px solid black; padding: 4px; padding-left: 20px;">Tarif
                    Retribusi yang harus dibayar/bulan: <br /> Rp
                    {{ number_format($data->tarifPerbulan, 2, ',', '.') }} <br />
                    <span style="text-transform: uppercase;">{{ $data->tarifPerbulan ? terbilang($data->tarifPerbulan) . ' Rupiah' : "-" }}</span>
                </td>
                <td colspan="2" style="witdth: 50%; border: 1px solid black; padding: 4px; padding-left: 20px;">
                    Tarif Retribusi yang harus dibayar/tahun:<br />
                    Rp {{ number_format($data->tarifPertahun, 2, ',', '.') }} <br />
                    <span style="text-transform: uppercase;">{{ $data->tarifPertahun ? terbilang($data->tarifPertahun) . ' rupiah' : '-' }}</span>
                </td>
            </tr>
            {{-- <tr style="font-size: 18px;">
                <td colspan="2" style="border: 1px solid black; padding: 4px; ">Objek Retribusi yang harus
                    dibayar/tahun: <br />Rp
                    {{ $data->tarifPertahun ? number_format($data->tarifPertahun, 2, ',', '.') : '-' }}</td>
                <td colspan="2" style="border: 1px solid black; padding: 4px; ">
                    Terbilang:<br>
                    <span style="text-transform: uppercase;">{{ terbilang($data->tarifPertahun) }} rupiah</span>
                </td>
            </tr> --}}
        </tbody>
    </table>
    <table class="lokasi" style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr>
            <td style="font-weight: 500; font-size: 20px; text-align: center; padding: 8px 0;">SKET LOKASI</td>
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
                <p
                    style="font-size: 18px; line-height: 0.8rem; width: max-content; margin: 0 auto 110px; text-transform: uppercase">
                    {{ $tandaTangan->jabatan1 }}<br />{{ $tandaTangan->kota }}<br />
                    {{ $tandaTangan->jabatan2 }}</p>
                <p
                    style="font-size: 18px; line-height: 0.7rem; text-align: left; display: inline-block; margin: 0 auto; width: 300px; text-transform: uppercase">
                    {{ $tandaTangan->nama }}
                    <br />NIP {{ $tandaTangan->nip }}
                </p>
            </td>
        </tr>
    </table>
    <table
        style="width: 100%; line-height: 0.6rem; text-align: justify; padding: 10px; border: 1px solid black; margin-top: 32px; font-size: 20px;">
        <tr>
            <td></td>
            <td>Keterangan:</td>
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">1.</td>
            {{-- <td>Wajib retribusi yang tidak melaksanakan kewajiaban pembayaran sehingga merugikan keuangan
                daerah diancam dengan pidana kurungan paling lama 3
                (Tiga) bulan dan denda paling banyak 3 (TIga) kali jumlah retribusi yang terhutang (Perda
                No.27
                Tahun 2011)</td> --}}
            <td>Pembayaran retribusi persampahan/kebersihan dapat dilakukan langsung oleh wajib retribusi dengan metode
                pembayaran dengan Transfer/QRIS/Virtual Account melalui rekening Bank Sumsel Babel Cabang Kolonel Atmo
                dengan Nomor Rekening 150.301.1511 An. Rekening Penampungan Retribusi Kebersihan, disertai narasi
                "Retribusi Kebersihan" dengan menyertakan nama wajib retribusi yang bersangkutan, bulan dan tahun yang
                berkenaan;</td>
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">2.</td>
            {{-- <td>Pembayaran/penyetoran retribusi kebersihan dapat dibayar / disetor pada petugas penagih
                retribusi kebersihan yang mendatangi tempat saudara, yang
                dilengkapi dengan surat tugas dan papan nama atau dibayar langsung ke bendahara penerimaan
                di
                kantor DLHK Palembang Jl. Sukarela No, 129 KM 7.
                Telp 415130 kota Palembang</td> --}}
            <td>Wajib Retribusi yang tidak melaksanakan kewajiban
                membayar atas layanan yang digunakan/dinikmati,
                sehingga merugikan Keuangan Daerah, diancam
                dengan pidana kurungan paling lama 3 (tiga) bulan
                atau pidana denda paling banyak 3 (tiga) kali dari
                jumlah Retribusi terutang yang tidak atau kurang
                dibayar;</td>
        </tr>

        <tr>
            <td style="width: 2%; vertical-align: top">3.</td>
            <td>Wajib Retribusi dikenakan sanksi
                administratif berupa bunga sebesar 1% (satu
                persen) per bulan dari Retribusi terutang yang
                tidak atau kurang dibayar dihitung dari tanggal
                jatuh tempo pembayaran sampai dengan tanggal
                pembayaran, untuk jangka waktu paling lama 24
                (dua puluh empat) bulan dan ditagih dengan
                menggunakan SPKRD;</td>
            {{-- <td>Penyetoran dan pembayaran retribusi kebersihan dapat juga dilakukan langsung oleh wajib
                retribusi melalui rekening Bank Sumsse Babel Cabang Kolonel
                Atmo dengan nomor rekening 150.30.0000.5 A/n. Pemerintah Kota Palembang, disertai narasi
                "Retribusi Kebersihan" dengan menyertakan nama retribusi
                yang bersangkutan dan tahun yang berkenaan</td> --}}
        </tr>
        <tr>
            <td style="width: 2%; vertical-align: top">4.</td>
            <td>Apabila wajib retribusi telah melakukan pembayaran terhadap tarif retribusi pelayanan
                persampahan/kebersihan, maka bukti pembayaran harus diserahkan kepada Dinas Lingkungan Hidup melalui
                petugas penagih yang telah ditetapkan.</td>
            {{-- <td>Penyetoran dan pembayaran retribusi kebersihan dapat juga dilakukan langsung oleh wajib
                retribusi melalui rekening Bank Sumsse Babel Cabang Kolonel
                Atmo dengan nomor rekening 150.30.0000.5 A/n. Pemerintah Kota Palembang, disertai narasi
                "Retribusi Kebersihan" dengan menyertakan nama retribusi
                yang bersangkutan dan tahun yang berkenaan</td> --}}
        </tr>
        {{-- <tr>
            <td style="width: 2%; vertical-align: top">4.</td>
            <td>Apabila penyetoran atau pembayaran retribusi kebersihan dilakukan secara non tunai
                transfer/bilyet giro/kriling maka jika ada biaya administrasi ataupun
                biaya-biaya lainnya sepenuhnya ditanggung oleh wajib retribusi yang bersangkutan</td>
        </tr> --}}
    </table>
    <div
        style="border-top: 3px dashed !important;  margin-top: 1.4rem; padding-top: 0.7rem; position: absolute; bottom: 0px; width: 100%; max-height: 6.3cm;">
        <table style="border-collapse: collapse; width: 100%; max-width: 800px;     line-height: 0.7rem; font-size: 18px;">
            <tr>
                <td style="width: 25%; vertical-align: top;">No. SPKRD</td>
                <td style="width: 25%;">: {{ $skrd->noSkrd ?? '-' }}</td>
                <td style="width: 25%; padding-left: 100px; white-space: nowrap;">Diterima Tanggal</td>
                <td style="width: 25%;">:</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">No. Wajib Retribusi</td>
                <td>: {{ $data->noWajibRetribusi ?? '-' }}</td>
                <td style="padding-left: 100px; white-space: nowrap;">Nama Penerima</td>
                <td>:</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Nama Wajib Retribusi</td>
                <td style="text-transform: capitalize;">
                    <div style="display: inline-table; box-sizing: border-box; padding: 0; margin: 0;">
                        <div style="display: table-row;">
                            <div style="display: table-cell;">:</div>
                            <div style="display: table-cell; padding-left: 4px; text-wrap: pretty;">{{ strtolower($data->namaObjekRetribusi) }}</div>
                        </div>
                    </div>

                    {{-- <div style="display: table;">
                        <div style="display: table-row; background: red;">
                            <div style="display: table-cell;">:</div>
                            <div style="display: table-cell; padding-left: 4px; text-transform: capitalize;">
                                {{ strtolower($data->namaObjekRetribusi) }}
                            </div>
                        </div>
                    </div> --}}
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Tarif Ketetapan / Bulan</td>
                <td>: Rp {{ number_format($data->tarifPerbulan, 2, ',', '.') }}</td>
                <td style="text-align: center; padding-left: 100px;">Penerima</td>
                <td style="text-align: center; padding-left: 100px;">Penagih</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Tarif Ketetapan / Tahun</td>
                <td>: Rp {{ number_format($data->tarifPertahun, 2, ',', '.') }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Jumlah Bulan</td>
                <td>: {{ $data->bulan ? $data->bulan . ' Bulan' : '-' }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Alamat</td>
                <td style="text-transform: capitalize;">
                    <div style="display: inline-table; box-sizing: border-box; padding: 0; margin: 0;">
                        <div style="display: table-row;">
                            <div style="display: table-cell;">:</div>
                            <div style="display: table-cell; padding-left: 4px; text-wrap: pretty;">
                                {{ strtolower($data->alamat) }}</div>
                        </div>
                    </div>
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Kelurahan</td>
                <td style="text-transform: capitalize;">: {{ strtolower($data->kelurahan->namaKelurahan) }}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">Kecamatan</td>
                <td style="text-transform: capitalize;">: {{ strtolower($data->kecamatan->namaKecamatan) }}</td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td style="text-align: center; text-transform: uppercase; padding-left: 100px;">{{ $data->pemilik->namaPemilik }}</td>
                <td style="text-align: center; text-transform: uppercase; padding-left: 100px;">{{ $data->penagih?->nama }}</td>
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
