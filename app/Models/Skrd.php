<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skrd extends Model
{
    protected $table = 'skrd';
    protected $fillable = [
        "noSkrd",
        "nomorOnly",
        "uptdId",
        'namaPendaftar',
        "petugasPendaftarId",
        "noWajibRetribusi",
        "namaObjekRetribusi",
        "pemilikId",
        "deskripsiUsaha",
        "kelurahanObjekRetribusi",
        "kecamatanObjekRetribusi",
        "alamatObjekRetribusi",
        "namaKategori",
        "namaSubKategori",
        "jumlahBulan",
        "tagihanPerBulanSkrd",
        "tagihanPerTahunSkrd",
        "tarifPerBulanObjekRetribusi",
        "tarifPerTahunObjekRetribusi",
        "terbilangTahun",
        "terbilangBulan",
        "latitudeObjekRetribusi",
        "longitudeObjekRetribusi",
        "tahun",
        "objekRetribusiId",
        "statusSkrd",
        "historyAction",
        "fileSkrd",
        "url_fileSkrd",
        "image",
        "url_image",
        "created_at",
        "updated_at",
        "varetribusi"
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $last = Skrd::orderBy('nomorOnly', 'desc')->first();
            $nextNumber = $last ? $last->nomorOnly + 1 : 1;

            $tahun = date('Y');

            $model->nomorOnly = $nextNumber;

            $model->noSkrd = sprintf("%s/SPKRD/DLH/%s", $nextNumber, $tahun);

            $lastWajib = WajibRetribusi::whereYear('created_at', date('Y'))
                ->get()
                ->sortByDesc(function ($item) {
                    $parts = explode('.', $item->noWajibRetribusi);

                    if (count($parts) === 3) {
                        return intval($parts[1]);
                    } else {
                        return intval($parts[0]);
                    }
                })
                ->first();

            if ($lastWajib) {
                $parts = explode('.', $lastWajib->noWajibRetribusi);
                if (count($parts) === 3) {
                    $lastNumber = intval($parts[1]);
                } else {
                    $lastNumber = intval($parts[0]);
                }
                $nextWajib = $lastNumber + 1;
            } else {
                $nextWajib = 1;
            }

            // dd($nextWajib);

            $formatted = str_pad($nextWajib, 3, '0', STR_PAD_LEFT);
            $noWajibRetribusi = $formatted . '.' . $tahun;

            // dd($noWajibRetribusi);

            $model->noWajibRetribusi = $noWajibRetribusi;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function uptd()
    {
        return $this->belongsTo(Uptd::class, 'uptdId', 'id');
    }

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'skrdId', 'id');
    }

    public function pemilik()
    {
        return $this->belongsTo(Pemilik::class, 'pemilikId', 'id');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'noSkrd', 'noSkrd');
    }

    public function wajibRetribusi()
    {
        return $this->belongsTo(WajibRetribusi::class, 'noWajibRetribusi', 'noWajibRetribusi');
    }
}
