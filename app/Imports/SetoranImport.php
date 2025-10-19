<?php

namespace App\Imports;

use App\Imports\Setoran\TemplateFirstImport;
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
            'KALIDONI' => new TemplateFirstImport(),
            'IT I' => new TemplateSecondImport(),
            'IB 2' => new TemplateThirdImport(),
            'Sako' => new TemplateThirdImport(),
            'Sukarami' => new TemplateThirdImport(),
        ];
    }
}
