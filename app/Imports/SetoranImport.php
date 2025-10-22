<?php

namespace App\Imports;

use App\Imports\Setoran\TemplateFirstImport;
use App\Imports\Setoran\TemplateFourthImport;
use App\Imports\Setoran\TemplateSecondImport;
use App\Imports\Setoran\TemplateThirdImport;
use App\Models\DetailSetoran;
use App\Models\Setoran;
use App\Models\Skrd;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Shared\Date;

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
            'KERTAPATI' => new TemplateThirdImport(),
            'JAKABARING' => new TemplateThirdImport(),
            'KEMUNING' => new TemplateThirdImport(),
            // 'AAL' => new TemplateFourthImport(),
            // 'IT3' => new TemplateThirdImport(),
            // 'GANDUS' => new TemplateThirdImport(),
            // 'IT2' => new TemplateThirdImport(),
            // 'BUKIT KECIL' => new TemplateThirdImport(),
            // 'SU1' => new TemplateThirdImport(),

            // 'SU2' => new TemplateThirdImport(),
        ];
    }
}
