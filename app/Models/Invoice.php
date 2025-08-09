<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'noSkrd',
        'jumlah_bulan',
        'satuan',
        'nama_bank',
        'atas_nama',
        'no_rekening',
        'total_retribusi',
        'terbilang'
    ];

    public function skrd()
    {
        return $this->belongsTo(Skrd::class, 'noSkrd', 'noSkrd');
    }

    protected static function booted()
    {
        static::creating(function ($invoice) {
            $year = now()->year;

            $latest = self::whereYear('created_at', $year)->orderBy('id', 'desc')->first();

            if ($latest && preg_match('/^(\d{4})\/STR\/DLH\/\d{4}$/', $latest->no_invoice, $matches)) {
                $lastNumber = (int) $matches[1];
            } else {
                $lastNumber = 0;
            }

            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            $invoice->no_invoice = "{$nextNumber}/STR/DLH/{$year}";
        });
    }
}
