<?php

namespace App\Http\Controllers;

use App\Models\Setoran;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class SetoranController extends Controller
{
    public function getBuktiSetoran(Setoran $setoran)
    {
        $setoran->load(['detailSetoran', 'skrd']);

        $kecamatan = $setoran->skrd->uptdId;
        $kuptd = User::where('uptdId', $kecamatan)->first();

        $pdf = Pdf::loadView('exports.setoran.index', [
            'setoran' => $setoran,
            'kuptd' => $kuptd
        ])
            ->setPaper('a4')
            ->setOptions([
                // 'dpi' => 150,
                // 'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => public_path(),
            ]);

        return $pdf->stream('setoran.pdf');
    }
}
