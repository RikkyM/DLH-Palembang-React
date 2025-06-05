<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemilik extends Model
{
    protected $table = 'pemilik';

    protected $fillable = [
        'kodeKelurahan',
        'kodeKecamatan',
        'namaPemilik',
        'jabatan',
        'nik',
        'alamat',
        'tempatLahir',
        'email',
        'noHp'
    ];
}
