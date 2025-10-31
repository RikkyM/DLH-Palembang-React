<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $table = 'kecamatan';
    protected $primaryKey = "kodeKecamatan";
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'namaKecamatan',
        'slug'
    ];

    protected static function booted()
    {
        static::creating(function ($kecamatan) {
            $allData = self::pluck('kodeKecamatan')->toArray();

            if (!empty($allData)) {
                $toNumber = array_map('intval', $allData);
                $maxKode = max($toNumber);
                $nextNumber = $maxKode + 1;
            } else {
                $nextNumber = 1;
            }

            $kecamatan->kodeKecamatan = str_pad($nextNumber, 2, '0', STR_PAD_LEFT);
        });
    }

    public function uptd()
    {
        return $this->hasOne(Uptd::class, 'kodeKecamatan', 'kodeKecamatan');
    }

    public function skrds()
    {
        return $this->hasManyThrough(
            Skrd::class,
            Uptd::class,
            'kodeKecamatan',
            'uptdId',
            'kodeKecamatan',
            'id'
        );
    }
}
