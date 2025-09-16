<?php

namespace App\Exports;

use App\Models\Skrd;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SkrdExport implements FromArray, ShouldAutoSize, WithStyles
{
    protected $id;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function array(): array
    {
        $data = Skrd::with([
            'user:id,namaLengkap,lokasi',
            'pembayaran' => function ($query) {
                $query->select('skrdId', 'jumlahBayar', 'tanggalBayar', 'pembayaranBulan')
                    ->orderBy('tanggalBayar');
            }
        ])
            ->addSelect([
                'skrd.*',
                'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                    ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                    ->whereColumn('skrdId', 'skrd.id')
            ])
            ->findOrFail($this->id);

        $header = [
            'NOMOR SKRD',
            'NO WAJIB RETRIBUSI',
            'TGL. SKRD',
            'NAMA OBJEK RETRIBUSI',
            'ALAMAT',
            'KELURAHAN',
            'KECAMATAN',
            'KLASIFIKASI - OBJEK',
            'KELAS',
            'JENIS/DESKRIPSI',
            'PER BULAN',
            'PER TAHUN',
            'JUMLAH TERTAGIH',
            'SISA TERTAGIH'
        ];

        $bulanNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];
        foreach ($bulanNames as $bulanName) {
            $header[] = $bulanName;
            $header[] = 'TGL BAYAR';
        }
        $header[] = 'STATUS';

        $row = [
            $data->noSkrd,
            $data->noWajibRetribusi,
            $data->created_at ? $data->created_at->format('d-m-Y') : '-',
            $data->namaObjekRetribusi ?? '-',
            $data->alamatObjekRetribusi,
            $data->kelurahanObjekRetribusi,
            $data->kecamatanObjekRetribusi,
            $data->namaKategori,
            $data->namaSubKategori,
            $data->deskripsiUsaha,
            $data->tagihanPerBulanSkrd,
            $data->tagihanPerTahunSkrd,
            $data->pembayaran_sum_jumlah_bayar,
            $data->tagihanPerTahunSkrd - $data->pembayaran_sum_jumlah_bayar
        ];

        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $pembayaranBulan = $data->pembayaran->filter(function ($pembayaran) use ($bulan) {
                $bulanArray = json_decode($pembayaran->pembayaranBulan, true);
                return is_array($bulanArray) && in_array($bulan, $bulanArray);
            });

            $totalBayarBulan = $pembayaranBulan->sum(function ($pembayaran) {
                $bulanArray = json_decode($pembayaran->pembayaranBulan, true);
                $jumlahBulan = count($bulanArray);
                return $jumlahBulan > 0 ? $pembayaran->jumlahBayar / $jumlahBulan : 0;
            });

            $tanggalBayarBulan = $pembayaranBulan->first() ?
                \Carbon\Carbon::parse($pembayaranBulan->first()->tanggalBayar)->format('d-m-Y') : '-';

            $row[] = $totalBayarBulan > 0 ? $bulan : '-';
            $row[] = $tanggalBayarBulan;
        }

        if ($data->tagihanPerTahunSkrd - $data->pembayaran_sum_jumlah_bayar == 0) {
            $row[] = 'Lunas';
        } elseif ($data->tagihanPerTahunSkrd - $data->pembayaran_sum_jumlah_bayar > 0) {
            $row[] = 'Belum Lunas';
        } else {
            $row[] = '-';
        }

        return [
            $header,
            $row
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]]
        ];
    }
}
