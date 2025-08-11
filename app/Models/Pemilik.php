<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemilik extends Model
{
    protected $table = 'pemilik';

    protected $fillable = [
        'kodeKecamatan',
        'kodeKelurahan',
        'namaPemilik',
        'jabatan',
        'nik',
        'alamat',
        'tempatLahir',
        'tanggalLahir',
        'email',
        'noHP'
    ];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'kodeKelurahan', 'kodeKelurahan');
    }
}
