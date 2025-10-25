<?php

namespace App\Exports;

use App\Models\Setoran;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SetoranExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithColumnFormatting, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Setoran::with('skrd')->get();
    }

    public function map($setoran): array
    {
        $status = $setoran->status;

        switch ($status) {
            case 'Approved':
                $status = 'Diterima';
                break;
            case 'Processed':
                $status = 'Diproses';
                break;
            case 'Cancelled':
                $status = 'Dibatalkan';
                break;
            case 'Rejected':
                $status = 'Ditolak';
                break;
            default:
                $status = '-';
                break;
        }

        return [
            $setoran->nomorNota,
            $setoran->skrd->noSkrd,
            $setoran->skrd->namaObjekRetribusi,
            $setoran->skrd->kecamatanObjekRetribusi,
            $setoran->metodeBayar ?? "-",
            $setoran->namaBank ?? "-",
            Carbon::parse($setoran->tanggalBayar)->format('d-m-Y'),
            $setoran->jumlahBayar,
            $setoran->jumlahBulan . ' Bulan',
            $setoran->noRef ?? "-",
            $setoran->namaPenyetor ?? "-",
            $setoran->keteranganBulan ?? "-",
            Carbon::parse($setoran->tanggal_diterima)->format('d-m-Y'),
            $status
        ];
    }

    public function headings(): array
    {
        return [
            'Nomor Nota',
            'No SPKRD',
            'Nama Objek Retribusi',
            'Kecamatan',
            'Cara Bayar',
            'Nama Bank',
            'Tanggal Bayar',
            'Jumlah Bayar',
            'Jumlah Bulan',
            'No. Referensi',
            'Pengirim / Penyetor',
            'Ket. Bulan Bayar',
            'Tanggal Keuangan',
            'Status'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]]
        ];
    }

    public function columnFormats(): array
    {
        $formatIDR = '_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"_);_(@_)';
        return [
            'H' => $formatIDR
        ];
    }
}
