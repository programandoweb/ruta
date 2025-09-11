<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCharacteristics extends Model
{
    use HasFactory;

    protected $table = 'user_characteristics';

    protected $fillable = [
        'user_id',
        'key',
        'value',
    ];

    /**
     * Relación: Una característica pertenece a un usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
