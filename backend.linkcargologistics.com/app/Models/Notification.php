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

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_user_id',
        'to_user_id',
        'status',
        'concepto',
        'descripcion',
        'tipo',
        'related_type',
    ];

    // Usuario que genera la notificación
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    // Usuario que recibe la notificación
    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
