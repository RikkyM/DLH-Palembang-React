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
        <tr>
            <td>{{ $data->noPendaftaran }}</td>
            <td>{{ $data->noWajibRetribusi }}</td>
            <td>{{ $data->namaObjekRetribusi }}</td>
            <td>{{ $data->pemilik->namaPemilik ?? '-' }}</td>
            <td>{{ $data->kelurahan->namaKelurahan ?? '-' }}</td>
            <td>{{ $data->kecamatan->namaKecamatan ?? '-' }}</td>
            <td>{{ $data->bentukBadanUsaha }}</td>
            <td>{{ $data->deskripsiUsaha }}</td>
            <td>{{ $data->alamat }}</td>
            <td>{{ $data->tarifPerbulan }}</td>
            <td>{{ $data->uptd->namaUptd ?? '-' }}</td>
            <td>{{ $data->user->namaLengkap ?? '-' }}</td>
            <td>{{ $data->status == 'Approved' ? 'Diterima' : 'Ditolak' }}</td>
        </tr>
    </tbody>
</table>
