<?php

namespace App\Exports;

use App\Models\Kecamatan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapPenerimaanKecamatanExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithColumnFormatting
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $startDate = $this->request->tanggal_mulai;
        $endDate = $this->request->tanggal_akhir;

        $rangeCol = DB::raw('DATE(COALESCE(tanggalSkrd, created_at))');

        return Kecamatan::with([
            'uptd.skrd' =>
            function ($q) use ($startDate, $endDate, $rangeCol) {
                if ($startDate || $endDate) {
                    $q->when($startDate && $endDate, fn($data) => $data->whereBetween($rangeCol, [$startDate, $endDate]))
                        ->when($startDate && !$endDate, fn($data) => $data->where($rangeCol, '>=', $startDate))
                        ->when(!$startDate && $endDate, fn($data) => $data->where($rangeCol, '<=', $endDate));
                } else {
                    $q->whereYear($rangeCol, Carbon::now()->year);
                }
            },
            'uptd.skrd.setoran' => function ($q) {
                $q->where('status', 'Approved')->where('current_stage', 'bendahara');
            },
            'uptd.skrd.detailSetoran',
            'uptd.skrd.pembayaran'
        ])
            ->get()
            ->map(function ($kec, $i) {
                $tagihanPertahun = $kec->uptd->skrd->sum('tagihanPerTahunSkrd');
                $totalBayar = $kec->uptd->skrd->sum(function ($skrd) {
                    $totalSetoran =
                        $skrd->detailSetoran
                        ->sum('jumlahBayar');
                    $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

                    return $totalSetoran + $totalPembayaran;
                });

                return [
                    'id'                => $i,
                    'namaKecamatan'     => $kec->namaKecamatan,
                    'kecamatan'         => $kec->uptd->skrd->count(),
                    'tagihanPertahun'   => $tagihanPertahun,
                    'totalBayar'        => $totalBayar,
                    'sisaBayar'         => ($tagihanPertahun - $totalBayar)
                ];
            })->values();
    }

    public function map($row): array
    {
        return [
            $row['id'] + 1,
            $row['namaKecamatan'] ?? '',
            (string) $row['kecamatan'] ?? "'0",
            (string) $row['tagihanPertahun'] ?? 0,
            (string) $row['totalBayar'] ?? 0,
            (string) $row['sisaBayar'] ?? 0,
        ];
    }

    public function headings(): array
    {
        return ['No', 'Total SPKRD', 'KECAMATAN', 'JUMLAH TAGIHAN', 'TOTAL BAYAR', 'SISA BAYAR'];
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
            'D' => $formatIDR,
            'E' => $formatIDR,
            'F' => $formatIDR
        ];
    }
}
