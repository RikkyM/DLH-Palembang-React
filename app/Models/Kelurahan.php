<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelurahan extends Model
{
    protected $table = 'kelurahan';
    protected $primaryKey = 'kodeKelurahan';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kodeKelurahan',
        'kodeKecamatan',
        'namaKelurahan',
        'slug'
    ];

    protected static function booted()
    {
        static::creating(function ($kelurahan) {
            if ($kelurahan->kodeKecamatan) {
                $kelurahan->kodeKelurahan = self::generateKodeKelurahan($kelurahan->kodeKecamatan);
            }
        });

        static::updating(function ($kelurahan) {
            if ($kelurahan->isDirty('kodeKecamatan') && $kelurahan->kodeKecamatan) {
                $kelurahan->kodeKelurahan = self::generateKodeKelurahan($kelurahan->kodeKecamatan);
            }
        });
    }

    /**
     * Generate kode kelurahan berdasarkan kode kecamatan
     */
    private static function generateKodeKelurahan($kodeKecamatan)
    {
        $allKodes = self::where('kodeKecamatan', $kodeKecamatan)
            ->pluck('kodeKelurahan')
            ->toArray();

        if (!empty($allKodes)) {
            $numbers = [];
            foreach ($allKodes as $kode) {
                $parts = explode('.', $kode);
                if (count($parts) >= 2) {
                    $numbers[] = (int) end($parts);
                }
            }

            $nextNumber = !empty($numbers) ? max($numbers) + 1 : 1;
        } else {
            $nextNumber = 1;
        }

        $formattedNumber = str_pad($nextNumber, 2, '0', STR_PAD_LEFT);
        return $kodeKecamatan . '.' . $formattedNumber;
    }

    public function kecamatan()
    {
        return $this->hasOne(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }
}
