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
        "longtitudeObjekRetribusi",
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
}
