<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'pathname',
        'description',
        'image',
        'cover',
        'type',
    ];

    public function related()
    {
        return $this->hasMany(Servicios::class, 'category_id');
    }
}
