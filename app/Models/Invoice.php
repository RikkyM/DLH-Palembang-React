<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'noSkrd',
        'satuan',
        'nama_bank',
        'atas_nama',
        'no_rekening',
        'sub_total',
        'total_retribusi',
        'terbilang'
    ];

    
}
