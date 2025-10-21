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
        'keterangan',
        "created_at",
        "updated_at",
    ];

    public function setoran()
    {
        return $this->belongsTo(Setoran::class, 'nomorNota', 'nomorNota');
    }

    public function skrd()
    {
        return $this->belongsTo(Skrd::class, 'skrdId', 'id');
    }
}
