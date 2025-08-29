<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use App\Models\Skrd;
use App\Models\User;
use App\Models\WajibRetribusi;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $getSearch = $request->get('search');
        $getSortBy = $request->get('sort', 'id');
        $getSortDir = $request->get('direction', 'asc');

        $query = Invoice::query()
            ->select('invoices.*')
            ->join('skrd', 'invoices.noSkrd', '=', 'skrd.noSkrd')
            ->with(['skrd:noSkrd,noWajibRetribusi,namaObjekRetribusi,alamatObjekRetribusi,tagihanPerBulanSkrd']);

        if ($getSearch && trim($getSearch) !== '') {
            $query->whereRelation('skrd', 'namaObjekRetribusi', 'like', "%{$getSearch}%");
        }

        switch ($getSortBy) {
            case 'noWajibRetribusi':
                $query->orderBy('skrd.noWajibRetribusi', $getSortDir);
                break;
            case 'namaObjekRetribusi':
                $query->orderBy('skrd.namaObjekRetribusi', $getSortDir);
                break;
            case 'jumlah_bulan':
            case 'satuan':
            case 'total_retribusi':
            case 'no_invoice':
            case 'id':
            default:
                $query->orderBy($getSortBy, $getSortDir);
                break;
        }

        $invoices = $query->paginate(10);

        $skrd = Skrd::select('noSkrd', 'noWajibRetribusi', 'namaObjekRetribusi', 'tagihanPerBulanSkrd')->get();

        return Inertia::render('Super-Admin/Pembayaran/Invoice/Index', [
            'datas' => $invoices,
            'filters' => [
                'search' => $getSearch && trim($getSearch) !== '' ? $getSearch : null,
                'sort' => $getSortBy,
                'direction' => $getSortDir
            ],
            'retribusiOptions' => $skrd
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InvoiceRequest $request)
    {
        // $request->validated();
        // dd($request->all());

        $skrd = Skrd::where('noSkrd', $request->noSkrd)->firstOrFail();
        $tarifRetribusi = $skrd->tagihanPerBulanSkrd;

        $total = $request->jumlahBulan > 0 ? $request->jumlahBulan * $tarifRetribusi : $tarifRetribusi;

        DB::beginTransaction();
        try {

            $invoice = Invoice::create([
                'noSkrd' => $request->noSkrd,
                'jumlah_bulan' => $request->jumlahBulan,
                'satuan' => $request->satuan,
                // 'nama_bank' => $request->namaBank,
                // 'atas_nama' => $request->pengirim,
                // 'no_rekening' => $request->noRekening,
                'total_retribusi' => $total,
                'terbilang' => trim(terbilang($total)),
                'tanggal_terbit' => $request->tanggalTerbit,
                'jatuh_tempo' => $request->jatuhTempo
            ]);

            // $pdf = Pdf::loadView('exports.invoices.invoice', ['invoice' => $invoice, 'skrd' => $skrd])->setPaper('a4');

            // $filename = str_replace('/', '-', $invoice->no_invoice) . '.pdf';

            // Storage::put('invoices/' . $filename, $pdf->output());

            // $invoice->update([
            //     'file' => $filename
            // ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['server' => 'Terjadi kesalahan saat menyimpan data.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // public function openFile($filename)
    public function openFile(Invoice $invoice)
    {
        // $path = storage_path('app/private/invoices/' . $filename);

        // if (!file_exists($path)) {
        //     abort(404);
        // }

        // return Response::file($path);

        $invoice->load('skrd');

        // $kuptd = Skrd::with('user')->whereHas('user', function($q) use ($invoice) {
        //     $q->where('uptdId', $invoice->skrd->uptdId)->where('role', 'ROLE_KUPTD');
        // });

        $kuptd = User::where('uptdId', $invoice->skrd->uptdId)->where('role', "ROLE_KUPTD")->first();
        // dd($kuptd->first());
        // // dd($invoice->skrd);

        $pdf = Pdf::loadView('exports.invoices.invoice', ['invoice' => $invoice, 'skrd' => $invoice->skrd, 'kuptd' => $kuptd])->setPaper('a4');
        // dd($data);
        return $pdf->stream("invoice.pdf");
    }

    public function previewPdf(Request $request)
    {
        $skrd = Skrd::where('noSkrd', $request->noSkrd)->firstOrFail();
        $tarifRetribusi = $skrd->tagihanPerBulanSkrd;

        $invoice = (object) [
            'id' => 1,
            'noSkrd' => $request->noSkrd,
            'jumlah_bulan' => $request->jumlahBulan,
            'satuan' => $request->satuan,
            'nama_bank' => $request->namaBank,
            'atas_nama' => $request->pengirim,
            'no_rekening' => $request->noRekening,
            'total_retribusi' => $request->jumlahBulan * $tarifRetribusi,
            'terbilang' => trim(terbilang($request->jumlahBulan * $tarifRetribusi)),
            'tanggalTerbit' => now(),
            'jatuhTempo' => now()
        ];

        $pdf = Pdf::loadView('exports.invoices.invoice', ['invoice' => $invoice, 'skrd' => $skrd])->setPaper('a4');

        return $pdf->stream('preview.pdf');
    }
}
