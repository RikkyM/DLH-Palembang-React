<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penagih extends Model
{
    protected $table = 'penagih';

    protected $fillable = [
        'nama', 'jabatan', 'statusPegawai', 'wilayah_uptd'
    ];
}
