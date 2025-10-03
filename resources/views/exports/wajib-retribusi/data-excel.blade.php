<table>
    <thead>
        <tr>
            <th>NO PENDAFTARAN</th>
            <th>NO WAJIB RETRIBUSI</th>
            <th>NAMA OBJEK RETRIBUSI</th>
            <th>PENANGGUNG JAWAB</th>
            <th>KELURAHAN</th>
            <th>KECAMATAN</th>
            <th>RINCIAN LAYANAN</th>
            <th>DETAIL RINCIAN</th>
            <th>BENTUK BADAN</th>
            <th>DESKRIPSI USAHA</th>
            <th>ALAMAT</th>
            <th>JUMLAH BULAN</th>
            <th>TARIF PERBULAN</th>
            <th>TARIF PERTAHUN</th>
            <th>LAYANAN</th>
            <th>KETERANGAN BULAN</th>
            <th>UNIT</th>
            <th>M2</th>
            <th>GIAT</th>
            <th>HARI</th>
            <th>METER</th>
            <th>TANGGAL SPKRD</th>
            <th>WILAYAH UPTD</th>
            <th>PETUGAS PENDAFTARAN</th>
            <th>STATUS</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $index => $item)
            <tr>
                <td>{{ $item->noPendaftaran }}</td>
                <td>{{ $item->noWajibRetribusi }}</td>
                <td>{{ $item->namaObjekRetribusi }}</td>
                <td>{{ $item->pemilik->namaPemilik ?? '-' }}</td>
                <td>{{ $item->kelurahan->namaKelurahan ?? '-' }}</td>
                <td>{{ $item->kecamatan->namaKecamatan ?? '-' }}</td>
                <td>{{ $item->kategori->namaKategori }}</td>
                <td>{{ $item->subKategori->namaSubKategori }}</td>
                <td>{{ $item->bentukBadanUsaha }}</td>
                <td>{{ $item->deskripsiUsaha }}</td>
                <td>{{ $item->alamat }}</td>
                <td>{{ $item->bulan ? "$item->bulan Bulan" : "-" }}</td>
                <td>{{ $item->tarifPerbulan }}</td>
                <td>{{ $item->tarifPertahun }}</td>
                <td>{{ match ($item->jenisTarif) {
                    'tarif' => 'Tarif 1',
                    'tarif2' => 'Tarif 2',
                    default => '-',
                } }}
                </td>
                <td>{{ $item->keteranganBulan }}</td>
                <td>{{ $item->unit ?? '-' }}</td>
                <td>{{ $item->m2 ?? '-' }}</td>
                <td>{{ $item->giat ?? '-' }}</td>
                <td>{{ $item->hari ?? '-' }}</td>
                <td>{{ $item->meter ?? '-' }}</td>
                <td>{{ $item->tanggalSkrd ? date('d-m-Y', strtotime($item->tanggalSkrd)) : \Carbon\Carbon::parse($item->created_at)->format('d-m-Y') }}
                </td>
                <td>{{ $item->uptd->namaUptd ?? '-' }}</td>
                <td>{{ $item->user->namaLengkap ?? '-' }}</td>
                <td>{{ $item->status_label }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
