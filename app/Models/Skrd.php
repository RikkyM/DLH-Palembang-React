<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use League\Flysystem\ChecksumProvider;

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
        'namaPenagih',
        "deskripsiUsaha",
        "kelurahanObjekRetribusi",
        "kecamatanObjekRetribusi",
        "alamatObjekRetribusi",
        "namaKategori",
        "namaSubKategori",
        'tanggalSkrd',
        "jumlahBulan",
        'keteranganBulan',
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

    public static function generateNoSkrd()
    {
        return DB::transaction(function () {
            $getYear = date('Y');

            $getSkrd = self::whereYear('created_at', $getYear)
                ->whereNotNull('noSkrd')
                ->where('noSkrd', '!=', '')
                ->lockForUpdate()
                ->orderByDesc('nomorOnly')
                ->get();

            $getFormat = '/SPKRD/DLH/' . $getYear;

            $validated = $getSkrd->filter(function ($q) use ($getFormat) {
                // return strpos($q->noSkrd, $getFormat) !== false;
                // return preg_match('/^\d+\/SPKRD\/DLH\/\d{4}$/', $q->noSkrd);
                return preg_match("/^\d+" . preg_quote($getFormat, '/') . '$/', $q->noSkrd);
            });

            if ($validated->isEmpty()) {
                return '001' . $getFormat;
            }

            $maxNumber = 0;

            foreach ($validated as $skrd) {
                if (preg_match('/^(\d+)\//', $skrd->noSkrd, $matches)) {
                    $number = (int) $matches[1];
                    if ($number > $maxNumber) {
                        $maxNumber = $number;
                    }
                }
            }

            $newNumber = $maxNumber + 1;

            $format = str_pad($newNumber, 3, '0', STR_PAD_LEFT);

            return $format . $getFormat;
        });
    }

    // public static function normalizeSkrd($noSkrd)
    // {
    //     if (preg_match('/^(\d+)\.[A-Z]\/SPKRD\/DLH\/(\d{4})$/', $noSkrd, $matches)) {
    //         $number = $matches[1] + 1;
    //         $year = $matches[2];
    //         $format = str_pad($number, 3, '0', STR_PAD_LEFT);
    //         return $format . '/SPKRD/DLH/' . $year;
    //     }

    //     if (preg_match('/^\d+\.[A-Z]\.\d+\.\d{4}$/', $noSkrd)) {
    //         return self::generateNoSkrd();
    //     }

    //     if (preg_match('/^\d+\/SPKRD\/DLH\/\d{4}$/', $noSkrd, $matches)) {
    //         return $noSkrd;
    //     }

    //     return self::generateNoSkrd();
    // }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $last = Skrd::orderBy('nomorOnly', 'desc')->first();
            $nextNumber = $last ? $last->nomorOnly + 1 : 1;

            $tahun = date('Y');

            $model->nomorOnly = $nextNumber;

            // $model->noSkrd = sprintf("%s/SPKRD/DLH/%s", $nextNumber, $tahun);

            // $lastWajib = WajibRetribusi::whereYear('created_at', date('Y'))
            //     ->get()
            //     ->sortByDesc(function ($item) {
            //         $parts = explode('.', $item->noWajibRetribusi);

            //         if (count($parts) === 3) {
            //             return intval($parts[1]);
            //         } else {
            //             return intval($parts[0]);
            //         }
            //     })
            //     ->first();

            // if ($lastWajib) {
            //     $parts = explode('.', $lastWajib->noWajibRetribusi);
            //     if (count($parts) === 3) {
            //         $lastNumber = intval($parts[1]);
            //     } else {
            //         $lastNumber = intval($parts[0]);
            //     }
            //     $nextWajib = $lastNumber + 1;
            // } else {
            //     $nextWajib = 1;
            // }

            // $formatted = str_pad($nextWajib, 3, '0', STR_PAD_LEFT);
            // $noWajibRetribusi = $formatted . '.' . $tahun;

            // // dd($noWajibRetribusi);

            // $model->noWajibRetribusi = $noWajibRetribusi;
        });
    }

    public function setoran()
    {
        return $this->hasMany(Setoran::class, 'skrdId');
    }

    public function detailSetoran()
    {
        return $this->hasMany(DetailSetoran::class, 'skrdId');
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

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'namaKecamatan', 'kecamatanObjekRetribusi');
    }
}
