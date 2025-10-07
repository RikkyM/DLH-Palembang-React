<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Skrd;
use App\Models\User;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function openFile(Invoice $invoice)
    {
        $invoice->load('skrd');
        $noInvoice = str_replace('/', '-', $invoice->no_invoice);

        $kuptd = User::where('uptdId', $invoice->skrd->uptdId)->where('role', "ROLE_KUPTD")->first();


        $pdf = Pdf::loadView('exports.invoices.invoice', ['invoice' => $invoice, 'skrd' => $invoice->skrd, 'kuptd' => $kuptd])->setPaper('a4');

        // $pdf->getDomPDF()->getCanvas()->get_cpdf()->setTitle($invoice->skrd->namaObjekRetribusi);
        // $pdf->getDomPDF()->getCanvas()->get_cpdf()->setTitle($invoice->skrd->namaObjekRetribusi);
        $pdf->getDomPDF()->add_info('Title', $invoice->no_invoice);

        return $pdf->stream("Tagihan-$noInvoice.pdf");
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
