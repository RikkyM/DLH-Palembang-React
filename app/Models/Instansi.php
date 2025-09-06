<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instansi extends Model
{
    protected $table = 'instansi';

    protected $fillable = [
        'namaInstansi',
        'alamatInstansi',
        'noTelepon',
        'email',
        'website',
        'instagram',
        'tiktok'
    ];
}
