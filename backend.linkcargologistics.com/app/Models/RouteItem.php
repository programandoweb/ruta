<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteItem extends Model
{
    use HasFactory;

    protected $table = 'route_items';

    protected $fillable = [
        'route_id',
        'name',
        'phone',
        'origin_address',
        'destination_address',
        'type',
        'status',
    ];

    /**
     * Relación con la ruta maestra.
     */
    public function route()
    {
        return $this->belongsTo(Route::class, 'route_id');
    }
}
