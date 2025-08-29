<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        .border-black {
            border: 1px solid black;
        }
    </style>
</head>

<body style="font-family: sans-serif; box-sizing: border-box;">
    <table style="line-height: 2px; width: 100%; border-collapse: collapse; margin-bottom: 40px;">
        <tr>
            <td style="width: max-content;">
                <img src="{{ public_path('/img/logo_palembang.webp') }}" alt="Pemerintah" height="50">
            </td>
            <td style="width: max-content;">
                <img src="{{ public_path('/img/dlh-logo.webp') }}" alt="dlh-logo" height="40">
            </td>
            <td style="text-align: center; font-size: 0.75rem; padding-right: 35px;">
                <p>Jl. Sukarela No. 129 A KM 7, Kel. Sukarami, Kec. Sukarami</p>
                <p>Telp. (0711) - 415130, http://dlh.palembang.go.id</p>
            </td>
            <td>
                <img src="{{ public_path('/img/Logo_EVP.webp') }}" alt="logo-evp" height="40">
            </td>
        </tr>
    </table>
    <h1 style="text-align: center; font-size: 0.9rem; letter-spacing: 0px">NOTA TAGIHAN JASA PELAYANAN
        PERSAMPAHAN/KEBERSIHAN</h1>
    <table style="width: 100%; line-height: 1.2rem; font-size: 0.9rem; padding: 5px 40px; border-collapse: collapse;">
        <tr>
            <td style="padding: 3px 0;">No. Invoice</td>
            <td>:</td>
            <td>{{ $invoice->no_invoice }}</td>
            <td>Tanggal</td>
            <td>:</td>
            <td>{{ \Carbon\Carbon::parse($invoice->tanggal_terbit)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td style="padding: 3px 0;">No. SKRD</td>
            <td>:</td>
            <td>{{ $invoice->noSkrd }}</td>
            <td style="vertical-align: top; white-space: nowrap;">Jatuh Tempo</td>
            <td style="vertical-align: top;">:</td>
            <td style="vertical-align: top; white-space: nowrap;">
                {{ \Carbon\Carbon::parse($invoice->jatuh_tempo)->translatedFormat('d F Y') }}
            </td>
            {{-- <td>Tanggal</td>
            <td>:</td>
            <td>{{ \Carbon\Carbon::parse($invoice->tanggal_terbit)->translatedFormat('d F Y') }}</td> --}}
        </tr>
        <tr>
            <td style="padding: 3px 0;">No. Wajib Retribusi</td>
            <td style="vertical-align: top;">:</td>
            <td style="vertical-align: top;">{{ $skrd->noWajibRetribusi }}</td>
            {{-- <td style="vertical-align: top; white-space: nowrap;">Jatuh Tempo</td>
            <td style="vertical-align: top;">:</td>
            <td style="vertical-align: top; white-space: nowrap;">{{ \Carbon\Carbon::parse($invoice->jatuh_tempo)->translatedFormat('d F Y') }}
            </td> --}}
        </tr>
        <tr>
            <td style="vertical-align: top; padding: 3px 0; width: 150px;">Nama Wajib Retribusi</td>
            <td style="vertical-align: top; padding: 3px 0;">:</td>
            <td style="vertical-align: top; padding: 3px 0;" colspan="4">{{ $skrd->namaObjekRetribusi }} </td>
        </tr>
        <tr>
            <td style="vertical-align: top; padding: 3px 0;">Alamat Layanan</td>
            <td style="vertical-align: top; padding: 3px 0;">:</td>
            <td style="vertical-align: top; padding: 3px 0;" colspan="4">{{ $skrd->alamatObjekRetribusi }}</td>
        </tr>
        {{-- <tr>
            <td style="vertical-align: top; padding: 3px 0;">Kelurahan</td>
            <td style="vertical-align: top; padding: 3px 0;">:</td>
            <td style="vertical-align: top; padding: 3px 0;" colspan="4">{{ $skrd->kelurahanObjekRetribusi }}</td>
        </tr>
        <tr>
            <td style="vertical-align: top; padding: 3px 0;">Kecamatan</td>
            <td style="vertical-align: top; padding: 3px 0;">:</td>
            <td style="vertical-align: top; padding: 3px 0;" colspan="4">{{ $skrd->kecamatanObjekRetribusi }}</td>
        </tr> --}}
    </table>
    <table style="width: 100%; padding: 20px 35px; border-collapse: collapse;">
        <thead style="font-size: .85rem;">
            <tr class="border-black">
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">No.</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Detail Layanan</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Rincian Detail Layanan</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Jumlah</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Satuan</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Tarif Retribusi</th>
                <th class="border-black" style="padding: 20px 10px; background: ##BEE5A7;">Sub Total</th>
            </tr>
        </thead>
        <tbody style="font-size: .85rem;">
            <tr>
                <td class="border-black" style="text-align: center; padding: 10px;">1.</td>
                <td class="border-black" style="text-align: center; padding: 10px;">{{ $skrd->deskripsiUsaha }}</td>
                <td class="border-black" style="text-align: center; padding: 10px;">{{ $skrd->namaKategori }}</td>
                <td class="border-black" style="text-align: center; padding: 10px;">{{ $invoice->jumlah_bulan }}</td>
                <td class="border-black" style="text-align: center; padding: 10px;">{{ $invoice->satuan }}</td>
                <td class="border-black" style="text-align: center; padding: 10px; white-space: nowrap;">Rp.
                    {{ number_format($skrd->tagihanPerBulanSkrd, 0, ',', '.') }},-</td>
                <td class="border-black" style="text-align: center; padding: 10px; white-space: nowrap;">Rp.
                    {{ number_format($invoice->total_retribusi, 0, ',', '.') }},-</td>
            </tr>
            <tr>
                <td class="border-black" style="text-align: center; padding: 10px;"></td>
                <td class="border-black" style="text-align: center; padding: 10px;"></td>
                <td class="border-black" style="text-align: center; padding: 10px;"></td>
                <td class="border-black" style="text-align: center; padding: 10px;"></td>
                <td class="border-black" style="text-align: center; padding: 10px;"></td>
                <td class="border-black" style="text-align: center; padding: 10px;">Total Retribusi</td>
                <td class="border-black" style="text-align: center; padding: 10px; white-space: nowrap;">Rp.
                    {{ number_format($invoice->total_retribusi, 0, ',', '.') }},-</td>
            </tr>
            <tr>
                <td class="border-black"
                    style="text-align: left; padding: 10px; text-transform: capitalize; font-weight: bold;"
                    colspan="7">Terbilang: {{ $invoice->terbilang }} Rupiah</td>
            </tr>
        </tbody>
    </table>
    <div style="padding: 5px 40px; font-size: .7rem; box-sizing: border-box;">
        <p style="margin: 0; padding: 2px 4px;">Keterangan:</p>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <td valign="top" style="width: 20px;">1.</td>
                <td style="width: 54%; text-wrap: pretty; line-height: 15px;">Pembayaran tagihan melalui:</td>
                <td></td>
                <td style="width: 31%; font-size: .85rem; padding-left: 100px;">Mengetahui,</td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">Nama Bank: Sumsel Babel Cabang Kolonel Atmo</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="width: 31%; font-size: .85rem; padding-left: 100px;" colspan="2">Kepala UPTD LH</td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">Atas Nama: Pemerintah Kota Palembang</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="width: 31%; font-size: .85rem; text-transform: capitalize; padding-left: 100px;" colspan="2">
                {{ Illuminate\Support\Str::lower($skrd->kecamatanObjekRetribusi) }}</td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">No. Rekening: 150.301.1511</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="vertical-align: top; font-size: .7rem;"></td>
                <td style="width: 31%;"></td>
            </tr>
            <tr>
                <td valign="top" style="width: 20px;">2.</td>
                <td style="width: 54%; text-wrap: pretty; line-height: 15px;">Setelah melakukan pembayaran melalui
                    transfer bank, mohon untuk mengirimkan
                    bukti transfer ke DLH
                    Kota Palembang, melalui Petugas Penagih Retribusi / UPTD/ Bidang PSLB3</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="width: 31%; font-size: .85rem; padding-left: 100px;" colspan="2">{{ $kuptd->namaLengkap }}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colspan="2" style="width: 31%; font-size: .85rem; padding-left: 100px;">Nip. {{ $kuptd->nip }}</td>
            </tr>
        </table>
    </div>
    {{-- <table style="border-collapse: collapse; width: 100%; padding: 5px 40px; line-height: 16px;">
        <tr>
            <td style="vertical-align: top; width: 23%; font-size: .7rem;">No. Rekening</td>
            <td style="vertical-align: top; width: 5%; font-size: .7rem;">:</td>
            <td style="vertical-align: top; font-size: .7rem;">150.301.1511</td>
            <td style="width: 31%; font-size: .85rem;">Mengetahui,</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style="width: 31%; font-size: .85rem;">Kepala UPTD LH</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style="width: 31%; font-size: .85rem; text-transform: capitalize;">
                {{ Illuminate\Support\Str::lower($skrd->kecamatanObjekRetribusi) }}</td>
        </tr>
    </table> --}}
    {{-- <div style="padding: 5px 40px; font-size: .7rem; box-sizing: border-box;">
        <p style="margin: 0; padding: 2px 4px;">Keterangan:</p>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <td valign="top" style="width: 20px;">1.</td>
                <td style="width: 54%; text-wrap: pretty; line-height: 15px;">Pembayaran tagihan melalui:</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">Nama Bank: Sumsel Babel Cabang Kolonel Atmo</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="vertical-align: top; font-size: .7rem;"></td>
                <td style="width: 31%;"></td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">Atas Nama: Pemerintah Kota Palembang</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="vertical-align: top; font-size: .7rem;"></td>
                <td style="width: 31%;"></td>
            </tr>
            <tr>
                <td style="vertical-align: top; width: 23%; font-size: .7rem;"></td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;">No. Rekening: 150.301.1511</td>
                <td style="vertical-align: top; width: 5%; font-size: .7rem;"></td>
                <td style="vertical-align: top; font-size: .7rem;"></td>
                <td style="width: 31%;"></td>
            </tr>
            <tr>
                <td valign="top" style="width: 20px;">2.</td>
                <td style="width: 54%; text-wrap: pretty; line-height: 15px;">Setelah melakukan pembayaran melalui
                    transfer bank, mohon untuk mengirimkan
                    bukti transfer ke DLH
                    Kota Palembang, melalui Petugas Penagih Retribusi / UPTD/ Bidang PSLB3</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="width: 31%; font-size: .85rem;">{{ $kuptd->namaLengkap }}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="width: 31%; font-size: .85rem;">Nip. {{ $kuptd->nip }}</td>
            </tr>
        </table>
    </div> --}}
    {{-- <h2>Invoice</h2>
    <p>No SKRD: {{ $invoice->noSkrd }}</p>
    <p>Jumlah Bulan: {{ $invoice->jumlah_bulan }}</p>
    <p>Satuan: {{ $invoice->satuan }}</p>
    <p>Total Retribusi: Rp {{ number_format($invoice->total_retribusi, 0, ',', '.') }}</p>
    <p>Terbilang: {{ $invoice->terbilang }}</p>
    <p>Bank: {{ $invoice->nama_bank }}</p>
    <p>Atas Nama: {{ $invoice->atas_nama }}</p>
    <p>No Rekening: {{ $invoice->no_rekening }}</p> --}}
</body>

</html>
