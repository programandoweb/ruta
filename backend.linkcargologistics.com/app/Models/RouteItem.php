<?php

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * Website: Programandoweb.net
 * Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteItem extends Model
{
    use HasFactory;

    protected $table = 'route_items';

    protected $fillable = [
        'route_id',
        'guide',
        'evidence_urls',
        'json_status',
        'name',
        'phone',
        'origin_address',
        'destination_address',
        'observation',      // ✅ NUEVO
        'type',
        'status',
        'lat',
        'lng',
        'day',
        'geo_cached_at',
        'guide_remote',
    ];

    protected $casts = [
        'evidence_urls' => 'array',
        'json_status'   => 'array',
        'lat'           => 'float',
        'lng'           => 'float',
        'day'           => 'integer',
        'geo_cached_at' => 'datetime',
    ];

    /**
     * Relación con la ruta maestra.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Routes::class, 'route_id');
    }
}
