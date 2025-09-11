<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'event_id',
        'servicio_id',
        'name',
        'description',
        'start_date',
        'due_date',
        'status',
        'employee_id',
        'provider_id',
    ];

    /**
     * Cliente relacionado a la tarea.
     */
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Evento relacionado a la tarea.
     */
    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }

    /**
     * Servicio relacionado a la tarea.
     */
    public function servicio()
    {
        return $this->belongsTo(\App\Models\Servicios::class, 'servicio_id');
    }
}
