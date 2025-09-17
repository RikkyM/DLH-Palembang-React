<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setoran extends Model
{
    protected $table = 'setoran';
    protected $primaryKey = "nomorSetoran";
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'skrdId',
        'noRef',
        'tanggalBayar',
        'jumlahBayar',
        'namaPenyetor',
        'keteranganBulan',
        'buktiBayar'
    ];

    public static function booted()
    {
        static::creating(function ($setoran) {
            $data = self::pluck('nomorNota')->toArray();


        });
    }
}
