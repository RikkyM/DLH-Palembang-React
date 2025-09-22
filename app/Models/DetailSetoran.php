<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailSetoran extends Model
{
    protected $table = 'detail_setoran';

    protected $fillable = [
        'skrdId',
        'nomorNota',
        'namaBulan',
        'tanggalBayar',
        'jumlahBayar',
        'keterangan'
    ];

    public function setoran()
    {
        return $this->belongsTo(Setoran::class, 'nomorNota', 'nomorNota');
    }
}
