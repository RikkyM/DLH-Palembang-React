<?php

namespace App\Imports;

use App\Imports\Setoran\TemplateFirstImport;
use App\Imports\Setoran\TemplateSecondImport;
use App\Imports\Setoran\TemplateThirdImport;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class SetoranImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            // 'KALIDONI' => new TemplateFirstImport(),
            // 'IT I' => new TemplateSecondImport(),
            // 'IB 2' => new TemplateThirdImport(),
            // 'Sako' => new TemplateThirdImport(),
            // 'Sukarami' => new TemplateThirdImport(),
            // 'IB1' => new TemplateThirdImport(),
            // 'KERTAPATI' => new TemplateThirdImport(),
            // 'JAKABARING' => new TemplateThirdImport(),
            // 'KEMUNING' => new TemplateThirdImport(),
            // 'Plaju' => new TemplateThirdImport(),
            // 'AAL' => new TemplateThirdImport(),
            // 'IT3' => new TemplateThirdImport(),
            // 'GANDUS' => new TemplateThirdImport(),
            // 'IT2' => new TemplateThirdImport(),
            // 'BUKIT KECIL' => new TemplateThirdImport(),
            // 'SU1' => new TemplateThirdImport(),
            // 'SU2' => new TemplateThirdImport(),
            'SEMABOR' => new TemplateThirdImport(),
        ];
    }
}
