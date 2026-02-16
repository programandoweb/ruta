<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteCacheBackground extends Model
{
    use HasFactory;

    protected $table = 'route_cache_backgrounds';

    protected $fillable = [
        'guide',
        'geo',
    ];

    protected $casts = [
        'geo' => 'array',
    ];
}
