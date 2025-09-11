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

class CalendarSlotAttention extends Model
{
    use HasFactory;

    protected $fillable = [
        'slot_id',
        'status',   // ← Agrega esto para permitir actualización
        'notes',
    ];

    /**
     * Slot al que pertenece el resumen de atención
     */
    public function slot()
    {
        return $this->belongsTo(CalendarSlots::class, 'calendar_slot_id');
    }

    /**
     * Proveedor que registró la atención
     */
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
