<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laporan Wajib Retribusi</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: #fff;
            margin: 0;
            padding: 15px;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
        }

        .header .left-logo img,
        .header .right-logo img {
            display: block;
        }

        .header .center-text {
            text-align: center;
            flex-grow: 1;
            padding: 0 10px;
        }

        .header .center-text p {
            margin: 2px 0;
            font-size: 11px;
        }


        .table-container {
            width: 100%;
            overflow-x: auto;
            margin: 20px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            font-size: 10px;
        }

        th {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: black;
            font-weight: bold;
            padding: 10px 6px;
            text-align: center;
            border: 1px solid #d1d5db;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 8px 6px;
            border: 1px solid #d1d5db;
            vertical-align: top;
            word-wrap: break-word;
        }

        tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        tbody tr:hover {
            background-color: #e0f2fe;
        }

        .no-column {
            width: 40px;
            text-align: center;
            font-weight: bold;
            background-color: #f1f5f9;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .status-approved {
            background-color: #dcfce7;
            color: #166534;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
            display: inline-block;
        }

        .col-no {
            width: 3%;
        }

        .col-reg {
            width: 8%;
        }

        .col-name {
            width: 12%;
        }

        .col-object {
            width: 12%;
        }

        .col-address {
            width: 15%;
        }

        .col-location {
            width: 8%;
        }

        .col-service {
            width: 10%;
        }

        .col-detail {
            width: 10%;
        }

        .col-uptd {
            width: 8%;
        }

        .col-officer {
            width: 8%;
        }

        .col-status {
            width: 6%;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }

        .footer-info {
            text-align: right;
        }

        .print-info {
            color: #6b7280;
            width: max-content;
        }

        .signature-section {
            float: right;
            text-align: center;
            width: 200px;
        }

        .signature-section .print-info {
            text-align: left;
        }

        .signature-space {
            height: 80px;
            width: 150px;
            margin: 15px auto;
        }

        .empty-state {
            text-align: center;
            color: #6b7280;
            font-style: italic;
            padding: 40px 20px;
            background-color: #f9fafb;
        }

        @media print {
            body {
                margin: 0;
                padding: 10px;
                font-size: 10px;
            }

            .header h1 {
                font-size: 16px;
            }

            table {
                font-size: 9px;
            }

            th {
                font-size: 8px;
                padding: 8px 4px;
            }

            td {
                padding: 6px 4px;
            }
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>

<body>
    <table>
        <tr style="border: none;">
            <td style="text-align: right; border: none;">
                <img src="{{ public_path('/img/logo_palembang.webp') }}" alt="Pemerintah" height="50">
                <img src="{{ public_path('/img/logo.webp') }}" alt="Pemerintah" height="45">
            </td>
            <td style="text-align: center; width: 300px; border: none;">
                <div class="center-text">
                    <p><strong>Dinas Lingkungan Hidup Kota Palembang</strong></p>
                    <p>Jl. Sukarela No. 129 A KM 7, Kel. Sukarami, Kec. Sukarami</p>
                    <p>Telp. (0711) – 415130, http://dlh.palembang.go.id</p>
                </div>
            </td>
            <td style="border: none;">
                <img src="{{ public_path('/img/Logo_EVP.webp') }}" alt="Bangga Melayani Bangsa" height="45">
            </td>
        </tr>
    </table>


    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th class="col-no">No</th>
                    <th class="col-reg">No SKRD</th>
                    <th class="col-reg">No Wajib Retribusi</th>
                    <th class="col-reg">Tanggal SKRD</th>
                    <th class="col-object">Nama Objek Retribusi</th>
                    <th class="col-address">Alamat</th>
                    <th class="col-location">Kelurahan</th>
                    <th class="col-location">Kecamatan</th>
                    <th class="col-service">Klasifikasi - Objek</th>
                    <th class="col-service">Kelas</th>
                    <th class="col-service">Jenis</th>
                    <th class="col-service">Per Bulan</th>
                    <th class="col-service">Per Tahun</th>
                    <th class="col-service">Jumlah Tertagih</th>
                    <th class="col-service">Sisa Tertagih</th>
                    <th class="col-uptd">UPTD</th>
                    <th class="col-status">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $index => $item)
                    <tr>
                        <td class="no-column">{{ $index + 1 }}</td>
                        <td class="text-center">{{ $item->noSkrd ?? '-' }}</td>
                        <td class="text-center">{{ $item->noWajibRetribusi ?? '-' }}</td>
                        <td class="text-center">{{ $item->created_at ? $item->created_at->format('d-m-Y') : '-' }}</td>
                        <td>{{ $item->namaObjekRetribusi ?? '-' }}</td>
                        <td>{{ Str::limit($item->alamatObjekRetribusi ?? '-', 50) }}</td>
                        <td>{{ $item->kelurahanObjekRetribusi ?? '-' }}</td>
                        <td>{{ $item->kecamatanObjekRetribusi ?? '-' }}</td>
                        <td>{{ $item->namaKategori ?? '-' }}</td>
                        <td>{{ $item->namaSubKategori ?? '-' }}</td>
                        <td>{{ $item->deskripsiUsaha ?? '-' }}</td>
                        <td>{{ $item->tarifPerBulanObjekRetribusi ?? '-' }}</td>
                        <td>{{ $item->tarifPerTahunObjekRetribusi ?? '-' }}</td>
                        <td style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Rp {{ number_format($item->pembayaran_sum_jumlah_bayar, 0, ',', '.') ?? '-' }}</td>
                        <td style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Rp {{ number_format($item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar, 0, ',', '.') ?? '-' }}</td>
                        <td>{{ $item->uptd->namaUptd ?? '-' }}</td>
                        <td class="text-center" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                            @if ($item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar === 0)
                                <span style="color: green;">Lunas</span>
                            @elseif ($item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar > 0)
                                <span style="color: red; ">Belum Lunas</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="12" class="empty-state">
                            <strong>Tidak ada data wajib retribusi</strong><br>
                            <small>Silakan periksa filter yang digunakan</small>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- <div class="footer">
        <div class="footer-info">
            <div class="signature-section">
                <div class="print-info">
                    <strong>Informasi Cetak:</strong><br>
                    Dicetak pada: {{ date('d F Y H:i:s') }}<br>
                </div>

                <p><strong>Mengetahui,</strong></p>
                <div class="signature-space"></div>
                <p><strong>Kepala Dinas</strong></p>
                <p style="font-size: 9px; color: #6b7280;">NIP: ________________</p>
            </div>
        </div>
    </div> --}}
</body>

</html>
