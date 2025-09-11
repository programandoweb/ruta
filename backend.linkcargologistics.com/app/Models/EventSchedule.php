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

class EventSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'client_id',
        'provider_id',
        'servicio_id',
        'status',
        'scheduled_at',
    ];

    // Relación con el evento
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Relación con el cliente (usuario que agenda)
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Relación con el proveedor (usuario que recibe la cita)
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    // Relación con el servicio agendado
    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
