<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Routes extends Model
{
    use HasFactory;

    protected $table = 'routes';

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'origin_address',
        'destination_address',
        'type',
        'date',
        'employees_id',
        'cache_json',
        'box_and_guide',
        'ia_status',
        'prompt',
    ];

    protected $casts = [
        'cache_json'    => 'array',
        'box_and_guide' => 'array',
        'date'          => 'date',
    ];

    /**
     * Relación con el usuario creador de la ruta.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con los items asociados a la ruta.
     */
    public function items()
    {
        return $this->hasMany(RouteItem::class, 'route_id');
    }
}
