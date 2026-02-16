<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RouteGeo extends Model
{
    protected $fillable = [
        'alias',
        'device_id',
        'latitude',
        'longitude',
        'accuracy',
        'speed',
        'altitude',
        'bearing',
        'battery_level',
        'is_charging',
        'device_timestamp',
        'ip',
        'user_agent',
        'raw_payload',
    ];

    protected $casts = [
        'raw_payload' => 'array',
        'device_timestamp' => 'datetime',
        'is_charging' => 'boolean',
    ];
}
