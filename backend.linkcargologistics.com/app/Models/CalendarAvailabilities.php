<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarAvailabilities extends Model
{
    use HasFactory;

    protected $table = 'calendar_availabilities';

    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'status',
        'provider_id',
        'client_id',
        'employee_id',
    ];

    protected $casts = [
        'weekday'    => 'integer',
        'start_time' => 'string',
        'end_time'   => 'string',
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
