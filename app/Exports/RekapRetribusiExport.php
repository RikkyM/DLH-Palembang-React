<?php

namespace App\Exports;

use App\Models\Uptd;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapRetribusiExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
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
        $filter = function ($query, $tanggal = 'tanggalBayar') use ($startDate, $endDate) {
            $query->when($startDate && $endDate, fn($q) => $q->whereBetween($tanggal, [$startDate, $endDate]))
                ->when($startDate && !$endDate, fn($q) => $q->where($tanggal, '>=', $startDate))
                ->when(!$startDate && $endDate, fn($q) => $q->where($tanggal, '<=', $endDate));
        };

        $rangeCol = DB::raw('DATE(COALESCE(tanggalSkrd, created_at))');

        return Uptd::with([
            'skrd' => fn($q) => $filter($q, $rangeCol),
            'skrd.pembayaran',
            'skrd.setoran',
            'skrd.detailSetoran'
        ])
            ->where('namaUptd', '!=', 'Dinas')
            ->get(['id', 'namaUptd'])
            ->map(function ($u, $i) {
                $tagihanPertahun = $u->skrd->sum('tagihanPerTahunSkrd');

                $totalBayar = $u->skrd->sum(function ($skrd) {
                    $totalSetoran    = $skrd->setoran
                        ->where('status', 'Approved')
                        ->where('current_stage', 'bendahara')
                        ->sum('jumlahBayar');
                    $totalPembayaran = $skrd->pembayaran->sum('jumlahBayar');

                    return $totalSetoran + $totalPembayaran;
                });

                return [
                    'id'        => $i,
                    'namaUptd'        => $u->namaUptd,
                    'tagihanPertahun' => $tagihanPertahun,
                    'totalBayar'      => $totalBayar,
                    'sisaBayar'       => $tagihanPertahun - $totalBayar,
                ];
            })->values();
    }

    public function map($row): array
    {
        return [
            $row['id'] + 1,
            $row['namaUptd'] ?? '',
            'Rp ' . number_format($row['tagihanPertahun'] ?? 0, 0, ',', '.'),
            'Rp ' . number_format($row['totalBayar'] ?? 0, 0, ',', '.'),
            'Rp ' . number_format($row['sisaBayar'] ?? 0, 0, ',', '.')
        ];
    }

    public function headings(): array
    {
        return ['no', 'WILAYAH UPTD', 'JUMLAH TAGIHAN', 'TOTAL BAYAR', 'SISA BAYAR'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]]
        ];
    }
}
