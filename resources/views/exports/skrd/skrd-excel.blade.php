<table>
    <thead>
        <tr>
            <th>NOMOR SKRD</th>
            <th>NO WAJIB RETRIBUSI</th>
            <th>TGL. SKRD</th>
            <th>NAMA OBJEK RETRIBUSI</th>
            <th>ALAMAT</th>
            <th>KELURAHAN</th>
            <th>KECAMATAN</th>
            <th>KLASIFIKASI - OBJEK</th>
            <th>KELAS</th>
            <th>JENIS/DESKRIPSI</th>
            <th>PER BULAN</th>
            <th>PER TAHUN</th>
            <th>JUMLAH TERTAGIH</th>
            <th>SISA TERTAGIH</th>
            @for ($bulan = 1; $bulan <= 12; $bulan++)
                <th>{{ strtoupper(now()->startOfYear()->addMonths($bulan - 1)->locale('id')->translatedFormat('M')) }}
                </th>
                <th>TGL BAYAR</th>
            @endfor
            <th>STATUS</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $index => $item)
            <tr>
                <td>{{ $item->noSkrd }}</td>
                <td>{{ $item->noWajibRetribusi }}</td>
                <td>{{ $item->created_at ? $item->created_at->format('d-m-Y') : '-' }}</td>
                <td>{{ $item->namaObjekRetribusi ?? '-' }}</td>
                <td>{{ $item->alamatObjekRetribusi }}</td>
                <td>{{ $item->kelurahanObjekRetribusi }}</td>
                <td>{{ $item->kecamatanObjekRetribusi }}</td>
                <td>{{ $item->namaKategori }}</td>
                <td>{{ $item->namaSubKategori }}</td>
                <td>{{ $item->deskripsiUsaha }}</td>
                <td>{{ $item->tagihanPerBulanSkrd }}</td>
                <td>{{ $item->tagihanPerTahunSkrd }}</td>
                <td>{{ $item->pembayaran_sum_jumlah_bayar }}</td>
                <td>{{ $item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar }}</td>
                @for ($bulan = 1; $bulan <= 12; $bulan++)
                    @php
                        $pembayaranBulan = $item->pembayaran->filter(function ($pembayaran) use ($bulan) {
                            $bulanArray = json_decode($pembayaran->pembayaranBulan, true);
                            return is_array($bulanArray) && in_array($bulan, $bulanArray);
                        });

                        $totalBayarBulan = $pembayaranBulan->sum(function ($pembayaran) {
                            $bulanArray = json_decode($pembayaran->pembayaranBulan, true);
                            $jumlahBulan = count($bulanArray);
                            return $jumlahBulan > 0 ? $pembayaran->jumlahBayar / $jumlahBulan : 0;
                        });

                        $tanggalBayarBulan = $pembayaranBulan->first()
                            ? \Carbon\Carbon::parse($pembayaranBulan->first()->tanggalBayar)->format('d-m-Y')
                            : '-';
                    @endphp
                    <td>{{ $totalBayarBulan > 0 ? $bulan : '-' }}</td>
                    <td>{{ $tanggalBayarBulan }}</td>
                @endfor
                <td>
                    @if ($item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar == 0)
                        Lunas
                    @elseif ($item->tagihanPerTahunSkrd - $item->pembayaran_sum_jumlah_bayar > 0)
                        Belum Lunas
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
