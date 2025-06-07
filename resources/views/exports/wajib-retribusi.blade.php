<table>
    <thead>
        <tr>
            <th>NO PENDAFTARAN</th>
            <th>NO WAJIB RETRIBUSI</th>
            <th>NAMA OBJEK RETRIBUSI</th>
            <th>PEMILIK</th>
            <th>KELURAHAN</th>
            <th>KECAMATAN</th>
            <th>BENTUK BADAN</th>
            <th>DESKRIPSI USAHA</th>
            <th>ALAMAT</th>
            <th>TARIF PERBULAN</th>
            <th>UPTD</th>
            <th>PETUGAS PENDAFTARAN</th>
            <th>STATUS</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $index => $item)
            <tr>
                <td>{{ $item->noPendaftaran }}</td>
                <td>{{ $item->noWajibRetribusi }}</td>
                <td>{{ $item->namaObjekRetribusi }}</td>
                <td>{{ $item->pemilik->namaPemilik ?? '-' }}</td>
                <td>{{ $item->kelurahan->namaKelurahan ?? '-' }}</td>
                <td>{{ $item->kecamatan->namaKecamatan ?? '-' }}</td>
                <td>{{ $item->bentukBadanUsaha }}</td>
                <td>{{ $item->deskripsiUsaha }}</td>
                <td>{{ $item->alamat }}</td>
                <td>{{ $item->tarifPerbulan }}</td>
                <td>{{ $item->uptd->namaUptd ?? '-' }}</td>
                <td>{{ $item->user->namaLengkap ?? '-' }}</td>
                <td>{{ $item->status }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
