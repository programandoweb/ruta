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
        'evidence_urls',
        'json_status',          // ✅ agregado
        'name',
        'phone',
        'origin_address',
        'destination_address',
        'type',
        'status',
        'lat',
        'lng',
        'geo_cached_at',
        'guide_remote',
    ];

    protected $casts = [
        'evidence_urls' => 'array',
        'json_status'   => 'array',   // ✅ casteo correcto
        'lat'           => 'float',
        'lng'           => 'float',
        'geo_cached_at' => 'datetime',
    ];

    public function route()
    {
        return $this->belongsTo(Routes::class, 'route_id');
    }
}
