<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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

    /**
     * Mutator untuk namaPemilik
     */
    protected function namaPemilik(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper($value)
        );
    }

    /**
     * Mutator untuk alamat
     */
    protected function alamat(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper($value)
        );
    }

    /**
     * Mutator untuk tempatLahir
     */
    protected function tempatLahir(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper($value)
        );
    }

    /**
     * Mutator untuk jabatan
     */
    protected function jabatan(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper($value)
        );
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'kodeKelurahan', 'kodeKelurahan');
    }

    public function uptd()
    {
        return $this->belongsTo(Uptd::class, 'kodeKecamatan', 'kodeKecamatan');
    }
}
