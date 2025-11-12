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
        'guide',
        'name',
        'phone',
        'origin_address',
        'destination_address',
        'type',
        'status',
        'lat',
        'lng',
        'geo_cached_at',
    ];

    protected $casts = [
        'lat'           => 'float',
        'lng'           => 'float',
        'geo_cached_at' => 'datetime',
    ];

    public function route()
    {
        // El modelo de la ruta es `App\Models\Routes`
        return $this->belongsTo(Routes::class, 'route_id');
    }
}
