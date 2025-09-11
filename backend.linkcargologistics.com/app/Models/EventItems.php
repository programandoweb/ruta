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

class EventItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'business_id',
        'servicio_id',
        'quantity',
        'notes',
        'status', // asegúrate de tener este campo
    ];


    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function servicio()
    {
        return $this->belongsTo(Servicios::class);
    }
}
