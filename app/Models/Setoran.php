<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Setoran extends Model
{
    protected $table = 'setoran';
    protected $primaryKey = "nomorNota";
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nomorNota',
        'skrdId',
        'noRef',
        'namaKecamatan',
        'tanggalBayar',
        'jumlahBayar',
        'jumlahBulan',
        'namaPenyetor',
        'keteranganBulan',
        'metodeBayar',
        'namaBank',
        'buktiBayar',
        'status',
        'current_stage',
        'tanggal_serah',
        'tanggal_diterima',
        'tanggal_batal',
        'keterangan',
        "created_at",
        "updated_at",
    ];

    protected static function booted()
    {
        static::creating(function ($setoran) {
            if (empty($setoran->nomorNota)) {
                $setoran->nomorNota = 'TEMP-' . Str::uuid()->toString();
            }
        });
    }

    // public static function booted()
    // {
    //     static::creating(function ($setoran) {

    //     });
    // }

    public static function generateNomorNota(): string
    {
        $year = date('Y');
        $prefix = "NP-RET/DLH/{$year}";

        $lastNote = self::whereYear('created_at', $year)
            ->where('nomorNota', 'like', "%/{$prefix}")
            ->orderByDesc('nomorNota')
            ->lockForUpdate()
            ->first();

        if ($lastNote) {
            $lastNumber = (int) substr($lastNote->nomorNota, 0, 4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = "0001";
        }
        // return "{$nextNumber}/NP-RET/DLH/{$year}";
        return "{$nextNumber}/{$prefix}";
    }

    public function skrd()
    {
        return $this->belongsTo(Skrd::class, 'skrdId', 'id');
    }

    public function detailSetoran()
    {
        return $this->hasMany(DetailSetoran::class, 'nomorNota', 'nomorNota');
    }
}
