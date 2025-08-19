<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $primaryKey = 'kodeKategori';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'namaKategori',
        'slug'
    ];

    protected static function booted()
    {
        static::creating(function ($kategori) {
            $allKodes = self::pluck('kodeKategori')->toArray();

            if (!empty($allKodes)) {
                $numericKodes = array_map('intval', $allKodes);
                $maxKode = max($numericKodes);
                $nextNumber = $maxKode + 1;
            } else {
                $nextNumber = 1;
            }

            $kategori->kodeKategori = str_pad($nextNumber, 2, '0', STR_PAD_LEFT);
        });
    }

    public function subKategori()
    {
        return $this->hasMany(SubKategori::class, 'kodeKategori', 'kodeKategori');
    }
}
