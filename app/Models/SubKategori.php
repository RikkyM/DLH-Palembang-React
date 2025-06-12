<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubKategori extends Model
{
    protected $table = 'sub_kategori';
    protected $primaryKey = 'kodeSubKategori';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kodeKategori',
        'namaSubKategori',
        'slug',
        'satuan',
        'perhitungan',
        'tarif',
    ];

    protected static function booted()
    {
        static::creating(function ($subKategori) {
            $allKodes = self::pluck('kodeSubKategori')->toArray();

            if (!empty($allKodes)) {
                $numericKodes = array_map('intval', $allKodes);
                $maxKode = max($numericKodes);
                $nextNumber = $maxKode + 1;
            } else {
                $nextNumber = 1;
            }

            $subKategori->kodeSubKategori = str_pad($nextNumber, 2, '0', STR_PAD_LEFT);
        });
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kodeKategori', 'kodeKategori');
    }
}
