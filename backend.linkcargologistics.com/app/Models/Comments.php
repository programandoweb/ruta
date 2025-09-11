<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    use HasFactory;

    // Definimos los campos que se pueden asignar en masa
    protected $fillable = [
        'mensaje',
        'module',
        'pathname',
        'user_id',
        'image',
        'json',
    ];
}
