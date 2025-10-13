<?php

namespace App\Exports;

use App\Models\Skrd;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapSpkrdExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $request;
    protected $mappedRows = [];

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $startDate = $this->request->tanggal_mulai;
        $endDate = $this->request->tanggal_akhir;
        $rangeCol = DB::raw("DATE(COALESCE(tanggalSkrd, created_at))");

        $pembayaranSubquery = DB::table('pembayaran as p')
            ->selectRaw('p.skrdId, SUM(p.jumlahBayar) as totalPembayaran')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween(DB::raw('DATE(p.tanggalBayar)'), [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where(DB::raw('DATE(p.tanggalBayar)'), '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where(DB::raw('DATE(p.tanggalBayar)'), '<=', $endDate))
            ->groupBy('p.skrdId');

        $detailSetoranSubquery = DB::table('detail_setoran as ds')
            ->join('setoran as s', 's.nomorNota', '=', 'ds.nomorNota')
            ->where('s.status', 'Approved')
            ->selectRaw('ds.skrdId, SUM(ds.jumlahBayar) as totalDetailSetoran')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween(DB::raw('DATE(ds.tanggalBayar)'), [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where(DB::raw('DATE(ds.tanggalBayar)'), '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where(DB::raw('DATE(ds.tanggalBayar)'), '<=', $endDate))
            ->groupBy('ds.skrdId');

        $query = Skrd::query()
            ->leftJoinSub($pembayaranSubquery, 'p', function ($join) {
                $join->on('skrd.id', '=', 'p.skrdId');
            })
            ->leftJoinSub($detailSetoranSubquery, 'ds', function ($join) {
                $join->on('skrd.id', '=', 'ds.skrdId');
            })
            ->when($startDate && $endDate, fn($q) => $q->whereBetween($rangeCol, [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where($rangeCol, '>=', $startDate))
            ->when(!$startDate && $endDate, fn($q) => $q->where($rangeCol, '<=', $endDate))
            ->select([
                DB::raw('MAX(id) as id'),
                'namaKategori',
                'namaSubKategori',
                DB::raw('COUNT(*) as jumlah'),
                DB::raw('SUM(COALESCE(tagihanPerTahunSkrd,0)) as tagihan'),
                DB::raw('SUM(COALESCE(p.totalPembayaran, 0) + COALESCE(ds.totalDetailSetoran, 0)) as total')
            ])
            ->groupBy('namaKategori', 'namaSubKategori')
            ->orderBy('namaKategori')
            ->orderBy('namaSubKategori');

        $rows = $query->get();

        return $rows->groupBy('namaKategori')->values()->map(function ($grp, $i) {
            return [
                'no' => $i + 1,
                'namaKategori' => $grp->first()->namaKategori,
                'subKategori' => $grp->values()->map(fn($r) => [
                    'label' => $r->namaSubKategori,
                    'jumlah' => (int) $r->jumlah,
                    'tagihan' => (int) $r->tagihan,
                    'totalBayar' => (int) $r->total
                ])->all(),
            ];
        });
    }

    public function map($row): array
    {
        $mapped = [];
        $subKategoriCount = count($row['subKategori']);

        foreach ($row['subKategori'] as $index => $sub) {
            $sisaBayar = $sub['tagihan'] - $sub['totalBayar'];

            $mapped[] = [
                $index === 0 ? $row['no'] : '',
                $index === 0 ? $row['namaKategori'] : '',
                $sub['label'],
                $sub['jumlah'],
                'Rp ' . number_format($sub['tagihan'] ?? 0, 0, ',', '.'),
                'Rp ' . number_format($sub['totalBayar'] ?? 0, 0, ',', '.'),
                'Rp ' . number_format($sisaBayar ?? 0, 0, ',', '.'),
            ];
        }

        $this->mappedRows[] = [
            'kategori' => $row['namaKategori'],
            'rowCount' => $subKategoriCount
        ];

        return $mapped;
    }

    public function headings(): array
    {
        return [
            'NO',
            'KATEGORI',
            'SUB KATEGORI',
            'JUMLAH SPKRD',
            'TOTAL TAGIHAN',
            'TOTAL BAYAR',
            'SISA BAYAR'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $currentRow = 2; // Start from row 2 (after header)

        foreach ($this->mappedRows as $mapped) {
            $rowCount = $mapped['rowCount'];

            if ($rowCount > 1) {
                // Merge cells untuk kolom NO (A) dan KATEGORI (B)
                $startRow = $currentRow;
                $endRow = $currentRow + $rowCount - 1;

                $sheet->mergeCells("A{$startRow}:A{$endRow}");
                $sheet->mergeCells("B{$startRow}:B{$endRow}");

                // Center alignment untuk merged cells
                $sheet->getStyle("A{$startRow}:A{$endRow}")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle("B{$startRow}:B{$endRow}")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            }

            $currentRow += $rowCount;
        }

        return [
            1 => ['font' => ['bold' => true]]
        ];
    }
}
