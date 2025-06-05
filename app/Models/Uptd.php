<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uptd extends Model
{
    protected $table = 'uptd';

    protected $fillable = [
        'nama',
        'alamat'
    ];
}
