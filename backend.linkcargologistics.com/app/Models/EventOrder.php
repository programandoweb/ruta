<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'provider_id',
        'employee_id',
        'event_id',
        'servicio_id',
        'calendar_slot_id',
        'price',
        'quantity',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function event()
    {
        return $this->belongsTo(Events::class, 'event_id');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicios::class, 'servicio_id');
    }

    public function calendar_slot()
    {
        return $this->belongsTo(CalendarSlots::class, 'calendar_slot_id');
    }
}
