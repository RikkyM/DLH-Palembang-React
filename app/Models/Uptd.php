<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uptd extends Model
{
    protected $table = 'uptd';

    protected $fillable = [
        'namaUptd',
        'alamat',
        'kodeKecamatan'
    ];

    public function user()
    {
        return $this->hasMany(User::class, 'uptdId', 'id');
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }
}
