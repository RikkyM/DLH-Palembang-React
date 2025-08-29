<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class WajibRetribusi extends Model
{
    protected $table = 'wajib_retribusi';

    protected $fillable = [
        'noWajibRetribusi',
        'noPendaftaran',
        'kodeKategori',
        'kodeSubKategori',
        'kodeKelurahan',
        'kodeKecamatan',
        'uptdId',
        'pemilikId',
        'petugasPendaftarId',
        'namaObjekRetribusi',
        'deskripsiUsaha',
        'bentukBadanUsaha',
        'alamat',
        'rt',
        'rw',
        'kota',
        'provinsi',
        'statusTempat',
        'latitude',
        'longitude',
        'image',
        'url_image',
        'file',
        'url_file',
        'linkMap',
        'jenisTarif',
        'bulan',
        'unit',
        'm2',
        'giat',
        'hari',
        'meter',
        'tarifPerbulan',
        'tarifPertahun',
        'jumlahBangunan',
        'jumlahLantai',
        'maksud',
        'keterangan',
        'status',
        'current_role',
        'createdThisYear',
        'historyAction',
    ];

    protected $casts = [
        'url_image' => 'array',
        'url_file' => 'array',
        'historyAction' => 'array'
    ];

    /**
     * Mutator untuk namaObjekRetribusi
     */
    protected function namaObjekRetribusi(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper($value)
        );
    }

    /**
     * Mutator untuk deskripsiUsaha
     */
    protected function deskripsiUsaha(): Attribute
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

    public function skrd()
    {
        return $this->belongsTo(Skrd::class, 'noWajibRetribusi', 'noWajibRetribusi');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'petugasPendaftarId', 'id');
    }

    public function pemilik()
    {
        return $this->belongsTo(Pemilik::class, 'pemilikId', 'id');
    }

    public function uptd()
    {
        return $this->belongsTo(Uptd::class, 'uptdId', 'id');
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kodeKategori', 'kodeKategori');
    }

    public function subKategori()
    {
        return $this->belongsTo(SubKategori::class, 'kodeSubKategori', 'kodeSubKategori');
    }

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'kodeKelurahan', 'kodeKelurahan');
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $last = self::orderBy('id', 'desc')->first();

            $lastNumber = 0;
            if ($last && preg_match('/^\d+$/', $last->noPendaftaran)) {
                $lastNumber = intval($last->noPendaftaran);
            }

            $nextNumber = $lastNumber + 1;

            $model->noPendaftaran = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        });
    }
}
