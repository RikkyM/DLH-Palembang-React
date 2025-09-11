<table>
    <thead>
        <tr>
            <th>NO</th>
            <th>NIK</th>
            <th>NAMA PEMOHON</th>
            <th>ALAMAT</th>
            <th>KELURAHAN</th>
            <th>KECAMATAN</th>
            <th>TEMPAT LAHIR</th>
            <th>TANGGAL LAHIR</th>
            <th>NOMOR HP</th>
            <th>EMAIL</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $index => $item)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>'{{ $item->nik }}</td>
                <td>{{ $item->namaPemilik }}</td>
                <td>{{ $item->alamat }}</td>
                <td>{{ $item->kelurahan->namaKelurahan ?? '-' }}</td>
                <td>{{ $item->kecamatan->namaKecamatan ?? '-' }}</td>
                <td>{{ $item->tempatLahir }}</td>
                <td>{{ date('d/m/Y', strtotime($item->tanggalLahir)) }}</td>
                <td>{{ $item->noHP ?? '-' }}</td>
                <td>{{ $item->email ?? '-' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
