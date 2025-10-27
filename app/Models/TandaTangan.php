<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TandaTangan extends Model
{
    protected $fillable = [
        'nama',
        'nip',
        'pangkat',
        'golongan',
        'jabatan1',
        'jabatan2',
        'kota'
    ];
}
