<?php

namespace App\Exports;

use App\Models\Skrd;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SkrdDataExport implements FromView, ShouldAutoSize, WithStyles, WithColumnFormatting
// WithEvents
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

        // $paidEfektif = "CASE WHEN COALESCE(pembayaran_sum_jumlah_bayar,0) > 0
        //             THEN COALESCE(pembayaran_sum_jumlah_bayar,0)
        //             ELSE COALESCE(setoran_sum_jumlah,0)
        //             END";

        $subPembayaran = "(select COALESCE(SUM(jumlahBayar),0)
                   from pembayaran
                   where skrdId = skrd.id)";

        $subSetoran    = "(select COALESCE(SUM(jumlahBayar),0)
                   from setoran
                   where skrdId = skrd.id
                     and status = 'Approved')";

        // 2) rumus bayar efektif TIDAK memakai alias, tapi pakai subquery di atas
        $paidEfektif = "CASE
                  WHEN {$subPembayaran} > 0 THEN {$subPembayaran}
                  ELSE {$subSetoran}
                END";

        $query = Skrd::query()
            ->with([
                'user:id,namaLengkap,lokasi',
                'pembayaran' => function ($query) {
                    $query->select('skrdId', 'jumlahBayar', 'tanggalBayar', 'pembayaranBulan')->orderBy('tanggalBayar');
                },
                'setoran' => fn($q) => $q->where('status', 'Approved'),
                'detailSetoran',
                'detailSetoran.setoran'
            ])
            ->orderByDesc('id');

        if (in_array(Auth::user()->role, ['ROLE_KUPTD', 'ROLE_KASUBAG_TU_UPDT'])) {
            $query->where('uptdId', Auth::user()->uptdId);
        }

        $query->addSelect([
            'skrd.*',
            'pembayaran_sum_jumlah_bayar' => DB::table('pembayaran')
                ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                ->whereColumn('skrdId', 'skrd.id'),
            'setoran_sum_jumlah' => DB::table('setoran')
                ->selectRaw('COALESCE(SUM(jumlahBayar), 0)')
                ->whereColumn('skrdId', 'skrd.id'),
            DB::raw("({$paidEfektif}) as jumlah_tertagih"),
            DB::raw("(COALESCE(tagihanPerTahunSkrd,0) - ({$paidEfektif})) as sisa_tertagih"),
            DB::raw("
                    CASE
                    WHEN COALESCE(tagihanPerTahunSkrd,0) = 0 THEN 'Tidak Ada Tagihan'
                    WHEN (COALESCE(tagihanPerTahunSkrd,0) - ({$paidEfektif})) <= 0 THEN 'Lunas'
                    ELSE 'Belum Lunas'
                    END as status_bayar
                "),
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

        if ($r->kecamatan) {
            $query->where('kecamatanObjekRetribusi', $r->kecamatan);
        }

        if ($r->kelurahan) {
            $query->where('kelurahanObjekRetribusi', $r->kelurahan);
        }

        if ($r->tahun) {
            $query->whereYear('created_at', $r->tahun);
        }

        // if ($r->status === 'lunas') {
        //     $query->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) = 0");
        // } elseif ($r->status === 'belum_lunas') {
        //     $query->havingRaw("(tagihanPerTahunSkrd - ({$paidEfektif})) > 0");
        // }

        if ($r->status === 'lunas') {
            $query->havingRaw("sisa_tertagih = 0");
        } elseif ($r->status === 'belum_lunas') {
            $query->havingRaw("sisa_tertagih > 0");
        }

        $data = $r->per_page != null ? $query->take((int) $r->get('per_page', 10))->get() : $query->get();

        // dd($data->map(function ($q) {
        //     if ($q->pembayaran->isNotEmpty()) {
        //         return [
        //             'pembayaran' => $q->pembayaran->pluck('jumlahBayar'),
        //             'detail' => $q->detailSetoran->pluck('jumlahBayar')
        //         ];
        //     }
        // }))->values();

        $bulanID = [
            'Januari' => 'January',
            'Februari' => 'February',
            'Maret' => 'March',
            'April' => 'April',
            'Mei' => 'May',
            'Juni' => 'June',
            'Juli' => 'July',
            'Agustus' => 'August',
            'September' => 'September',
            'Oktober' => 'October',
            'November' => 'November',
            'Desember' => 'December'
        ];

        // $formatTgl = collect(range(1, 12))->map(function ($tgl) use ($bulanID) {
        //     return Str::title(strtolower(Carbon::create()->month($tgl)->translatedFormat('F')));
        // })->values();

        // $tanggalBayar = (clone $data)->map(function ($item, $index) use ($formatTgl) {
        //     return $item->detailSetoran->map(function($q) use ($formatTgl) {
        //         return $q->namaBulan == $formatTgl;
        //     })->toArray();
        // })->values();

        $bulanMap = collect(range(1, 12))->mapWithKeys(function ($m) {
            $nama = Str::title(
                Carbon::create()->month($m)->locale('id')->translatedFormat('F')
            );

            return [$m => $nama];
        });

        return view('exports.skrd.skrd-excel', compact('data', 'bulanMap'));
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
            'K' => $formatIDR,
            'L' => $formatIDR,
            'M' => $formatIDR,
            'N' => $formatIDR,
            'O' => $formatIDR,
            'Q' => $formatIDR,
            'S' => $formatIDR,
            'U' => $formatIDR,
            'W' => $formatIDR,
            'Y' => $formatIDR,
            'AA' => $formatIDR,
            'AC' => $formatIDR,
            'AE' => $formatIDR,
            'AG' => $formatIDR,
            'AI' => $formatIDR,
            'AK' => $formatIDR,
        ];
    }

    // public function registerEvents(): array
    // {
    //     return [
    //         AfterSheet::class => function (AfterSheet $event) {
    //             $sheet = $event->sheet->getDelegate();
    //             $sheet->getStyle('K:L')
    //                 ->getNumberFormat()
    //                 ->setFormatCode('[$Rp-421] #,##0');
    //         }
    //     ];
    // }
}
