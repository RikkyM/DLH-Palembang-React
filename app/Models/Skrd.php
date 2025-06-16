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
        return $this->belongsTo(User::class, 'petugasPendaftarId', 'id');
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kodeKategori', 'kodeKategori');
    }

    public function subKategori()
    {
        return $this->belongsTo(SubKategori::class, 'kodeSubKategori', 'kodeSubKategori');
    }

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'skrdId', 'id');
    }
}
