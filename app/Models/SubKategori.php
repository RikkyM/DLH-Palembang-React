<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubKategori extends Model
{
    protected $table = 'sub_kategori';
    protected $primaryKey = 'kodeKategori';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kodeKategori',
        'namaSubKategori',
        'slug',
        'tarif',
        'perhitungan',
        'satuan'
    ];


}
