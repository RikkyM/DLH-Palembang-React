<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setoran extends Model
{
    protected $table = 'setoran';
    protected $primaryKey = "nomorNota";
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'skrdId',
        'noRef',
        'tanggalBayar',
        'jumlahBayar',
        'jumlahBulan',
        'namaPenyetor',
        'keteranganBulan',
        'metodeBayar',
        'namaBank',
        'buktiBayar',
        'status',
        'current_stage'
    ];

    public static function booted()
    {
        static::creating(function ($setoran) {
            $year = date('Y');

            $lastNote = self::whereYear('created_at', $year)
                ->orderByDesc('nomorNota')
                ->first();

            if ($lastNote) {
                $lastNumber = (int) substr($lastNote->nomorNota, 0, 4);
                $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = "0001";
            }
            $setoran->nomorNota = "{$nextNumber}/NP-RET/DLH/{$year}";
        });
    }

    public function skrd() {
        return $this->belongsTo(Skrd::class, 'skrdId', 'id');
    }

    public function detailSetoran()
    {
        return $this->hasMany(DetailSetoran::class, 'nomorNota', 'nomorNota');
    }
}
