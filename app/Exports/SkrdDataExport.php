<?php

namespace App\Exports;

use App\Models\Skrd;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SkrdDataExport implements FromView, ShouldAutoSize, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Skrd::all();
    }

    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function view(): View
    {
        Carbon::setLocale('id');

        $query = Skrd::query()
            ->with(['user:id,namaLengkap,lokasi', 'pembayaran' => function ($query) {
                $query->select('skrdId', 'jumlahBayar', 'tanggalBayar', 'pembayaranBulan')->orderBy('tanggalBayar');
            }])
            ->addSelect([
                'skrd.*',
                'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                    ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                    ->whereColumn('skrdId', 'skrd.id')
            ]);

        $r = $this->request;

        if ($r->search) {
            $query->where('namaObjekRetribusi', 'like', "%{$r->search}%");
        }

        if ($r->kategori) {
            $query->where('namaKategori', $r->kategori);
        }

        if ($r->{'sub-kategori'}) {
            $query->where('namaSubKategori', $r->{'sub-kategori'});
        }

        if ($r->petugas) {
            $query->where('petugasPendaftarId', $r->petugas);
        }

        if ($r->status === 'lunas') {
            $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) = 0');
        } elseif ($r->status === 'belum_lunas') {
            $query->havingRaw('(tagihanPerTahunSkrd - pembayaran_sum_jumlah_bayar) > 0');
        }

        $data = $r->per_page != null ? $query->take((int) $r->get('per_page', 10))->get() : $query->get();

        $p = collect(range(1, 12))->map(
            fn($q, $i) =>
            Str::title(strtolower(Carbon::create()->month($i + 1)->locale('id')->translatedFormat('F')))
        );

        dd($p);

        return view('exports.skrd.skrd-excel', compact('data'));
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]]
        ];
    }
}
