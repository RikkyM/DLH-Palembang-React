<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $setoran->nomorNota }}</title>
    <style>
        @page {
            margin: 15px 5px;
        }

        /* @font-face {
            font-family: 'bos';
            font-style:
        } */

        * {
            font-family: 'Bookman Old Style';
        }

        @font-face {
            font-family: 'Bookman Old Style';
            font-style: normal;
            font-weight: 400;
            src: url('{{ public_path('fonts/BOS/bos-regular.ttf') }}') format('truetype');
        }

        @font-face {
            font-family: 'Bookman Old Style';
            font-style: normal;
            font-weight: 700;
            src: url('{{ public_path('fonts/BOS/bos-bold.ttf') }}') format('truetype');
        }

        html,
        body {
            margin: 15px 5px;
            padding: 0;
        }

        * {
            box-sizing: border-box;
        }
    </style>
</head>

<body>
    <div style="height: 10.8cm; padding: 0; margin: 0; font-family: 'Bookman Old Style', serif;">
        <table
            style="width: 100%; height: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid black;">
            <tr style="height: 100%;">
                <td style="border: 1px solid black; height: 100%; width: 20%; position: relative; padding: 0;">
                    <div
                        style="
                        position: absolute;
                        top: 60%;
                        left: 60%;
                        transform: translate(-50%, -50%) rotate(-90deg);
                        transform-origin: center center;
                        white-space: nowrap;
                        display: inline-block;
                        line-height: 0;
                    ">
                        <img style="height: 130px; display: inline-block; vertical-align: middle;"
                            src="{{ public_path('/img/logo_palembang.webp') }}" alt="Pemerintah">
                        <img style="height: 130px; display: inline-block; vertical-align: middle;"
                            src="{{ public_path('/img/dlh-logo.webp') }}" alt="Pemerintah">
                    </div>
                </td>
                <td style="border: 1px solid black; height: 100%; width: 80%; vertical-align: top; position: relative">
                    <img style="position: absolute; top: 10px; right: 10px; width: 100px;"
                        src="{{ public_path('/img/Logo_EVP.webp') }}" alt="Pemerintah">
                    <table style="height: 100%; width: 100%; font-size: 12px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th colspan="3" style="padding-bottom: 50px; font-size: 16px;">NOTA PEMBAYARAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;">Nomor Nota</td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;">:</td>
                                <td style="padding: 3px 4px;">{{ $setoran->nomorNota }}</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;">Terima Dari</td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;">:</td>
                                <td style="width: 420px; padding: 3px 4px; text-transform: capitalize;">
                                    {{ strtolower($setoran->skrd->namaObjekRetribusi) }}</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;">Terbilang</td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;">:</td>
                                <td style="width: 420px; padding: 3px 4px; text-transform: capitalize;">
                                    {{ terbilang($setoran->jumlahBayar) }}</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;">Untuk Pembayaran</td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;">:</td>
                                <td style="width: 420px; padding: 3px 4px; text-transform: capitalize;">Retribusi Jasa
                                    Pelayanan Kebersihan/Persampahan Perkantoran</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;"></td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;"></td>
                                <td style="width: 420px; padding: 2px 4px; text-transform: capitalize;">Bulan
                                    @foreach ($setoran->detailSetoran as $item)
                                        {{ $item->namaBulan }}@if (!$loop->last)
                                            ,
                                        @endif
                                    @endforeach
                                    {{ date('Y', strtotime($setoran->tanggalBayar)) }}

                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 3px 4px;"></td>
                                <td style="width: 20px; vertical-align: top; padding: 3px 4px;"></td>
                                <td
                                    style="width: 420px; padding: 0 4px 3px; text-transform: capitalize; vertical-align: top; line-height: 1.15rem;">
                                    {{ strtolower($setoran->skrd->alamatObjekRetribusi) }}, Kel.
                                    {{ strtolower($setoran->skrd->kelurahanObjekRetribusi) }} Kecamatan
                                    {{ strtolower($setoran->skrd->kecamatanObjekRetribusi) }}</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 0 4px 3px; padding-bottom: 10px;">
                                    Metode Bayar
                                </td>
                                <td style="width: 20px; vertical-align: top; padding: 0 4px 3px; padding-bottom: 10px;">
                                    :
                                </td>
                                <td
                                    style="width: 420px; padding: 0 4px 3px; text-transform: capitalize;  vertical-align: top;">
                                    {{ $setoran->metodeBayar }}
                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 5px; padding-bottom: 50px;"></td>
                                <td style="width: 20px; vertical-align: top; padding: 5px; padding-bottom: 50px;"></td>
                                <td
                                    style="width: 420px; padding: 5px; text-transform: capitalize; padding-bottom: 50px; vertical-align: middle;">
                                    <div style="padding-left: 120px; padding: 3px auto;">
                                        <span style="margin-right: 20px;">Palembang,</span>
                                        {{ \Carbon\Carbon::parse($setoran->created_at)->translatedFormat('F Y') }}
                                    </div>
                                    <div style="padding-left: 120px; padding: 3px auto;">Verifikator</div>
                                    <div style="padding-left: 120px; padding: 3px auto;">Kepala UPTD Kec.
                                        {{ strtolower($setoran->skrd->kecamatanObjekRetribusi) }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; padding: 5px;" colspan="2">
                                    <div
                                        style="border-top: 2px double black; border-bottom: 2px double black; border-width: 3px; font-weight: 700; font-size: 14px; letter-spacing: .03rem; vertical-align: middle;">
                                        Rp. {{ number_format($setoran->jumlahBayar, 0, ',', '.') }},-
                                    </div>
                                </td>
                                {{-- <td style="width: 20px; vertical-align: top; padding: 5px; padding-bottom: 50px;"></td> --}}
                                <td
                                    style="width: 420px; padding: 5px; text-transform: capitalize; padding-bottom: 10px; vertical-align: middle; font-weight: 700;">
                                    <div style="padding-left: 120px; padding: 3px auto;">{{ $kuptd->namaLengkap }}
                                    </div>
                                    <div style="padding-left: 120px; padding: 3px auto;">Nip. {{ $kuptd->nip }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
