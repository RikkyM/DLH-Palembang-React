<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\Cast\String_;

class WajibRetribusi extends Model
{
    protected $table = 'wajib_retribusi';

    protected $fillable = [
        'noWajibRetribusi',
        'noSkrd',
        'noPendaftaran',
        'kodeKategori',
        'kodeSubKategori',
        'kodeKelurahan',
        'kodeKecamatan',
        'uptdId',
        'pemilikId',
        'petugasPendaftarId',
        'penagihId',
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
        'keteranganBulan',
        'tanggalSkrd',
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

            // $model->noWajibRetribusi = self::generateNoWajibRetribusi();
        });
    }

    /**
     * Method generate nomor wajib retribusi
     */
    protected static function generateNoWajibRetribusi()
    {
        return DB::transaction(function () {
            $tahun = date('Y');

            $lastWajib = WajibRetribusi::whereYear('updated_at', $tahun)
                ->whereNotNull('noWajibRetribusi')
                ->where('noWajibRetribusi', '!=', '')
                ->lockForUpdate()
                ->get()
                ->map(function ($item) {
                    $parts = explode('.', $item->noWajibRetribusi);

                    if (count($parts) === 3) {
                        $nomor = (int) $parts[1];
                        $tahun = (int) $parts[2];
                    } else {
                        $nomor = (int) $parts[0];
                        $tahun = (int) $parts[1];
                    }

                    $item->nomor_urut = $nomor;
                    $item->tahun_urut = $tahun;

                    return $item;
                })
                ->sortByDesc('tahun_urut')
                ->sortByDesc('nomor_urut')
                ->first();

            $lastNumber = 0;
            if ($lastWajib) {
                $parts = explode('.', $lastWajib->noWajibRetribusi);
                $lastNumber = count($parts) === 3 ? intval($parts[1]) : intval($parts[0]);
            }

            $nextWajib = $lastNumber + 1;
            $formatted = str_pad($nextWajib, 3, '0', STR_PAD_LEFT);
            // dd($formatted);

            return $formatted . '.' . $tahun;
        });
    }

    public function getStatusLabelAttribute(): String
    {
        return match (true) {
            $this->status === 'Approved'  && !is_null($this->current_role)             => 'Diterima',
            $this->status === 'Processed'  && $this->current_role == auth()->user()->role             => 'Diterima',
            $this->status === 'Processed'                                                => 'Diproses',
            $this->status === 'Processed'  && $this->current_role != auth()->user()->role             => 'Diproses',
            $this->status === 'Rejected'                                                 => 'Ditolak',
            $this->status === 'Approved'  && is_null($this->current_role)               => 'Selesai',
            $this->status === 'Finished' && $this->current_role === 'ROLE_KABID'        => 'Selesai',
            default                                                                       => '-',
        };
    }

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

    public function penagih()
    {
        return $this->belongsTo(Penagih::class, 'penagihId', 'id');
    }
}
