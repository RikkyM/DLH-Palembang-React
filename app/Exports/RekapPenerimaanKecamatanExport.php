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

        $p = Kecamatan::with([
            'uptd.skrd' =>
            function ($q) use ($startDate, $endDate, $rangeCol) {
                $q->when(
                    $startDate || $endDate,
                    function ($q) use ($startDate, $endDate, $rangeCol) {
                        if ($startDate && $endDate) {
                            [$from, $to] = $startDate <= $endDate ? [$startDate, $endDate] : [$endDate, $startDate];
                            $q->whereBetween($rangeCol, [$from, $to]);
                        } elseif ($startDate) {
                            $q->where($rangeCol, '>=', $startDate);
                        } else {
                            $q->where($rangeCol, '<=', $endDate);
                        }
                    },
                    function ($q) use ($rangeCol) {
                        $q->whereBetween($rangeCol, [
                            Carbon::now()->startOfYear()->toDateString(),
                            Carbon::now()->endOfYear()->toDateString(),
                        ]);
                    }
                );
            },
            'uptd.skrd.setoran',
            'uptd.skrd.detailSetoran',
            'uptd.skrd.pembayaran'
        ])
            ->first()
            ->uptd->skrd;
        dd($p);
    }
}
