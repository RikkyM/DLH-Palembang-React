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

    public function skrd()
    {
        return $this->hasMany(Skrd::class, 'uptdId', 'id');
    }

    public function skrds()
    {
        return $this->hasMany(Skrd::class, 'uptd_p_jawab', 'namaUptd');
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kodeKecamatan', 'kodeKecamatan');
    }
}
