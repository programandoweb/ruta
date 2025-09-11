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

class Events extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'event_date',
        'budget',
        'guests',
        'notes',
        'employee_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(EventItems::class, 'event_id')->with(["servicio","event"]);
    }

    public function servicios()
    {
        return $this->hasManyThrough(
            \App\Models\Servicios::class,
            \App\Models\EventItems::class,
            'event_id',     // Foreign key en event_items
            'id',           // Foreign key en servicios
            'id',           // Local key en events
            'servicio_id'   // Local key en event_items
        );
    }
}
