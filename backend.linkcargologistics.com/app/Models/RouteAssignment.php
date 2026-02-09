<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteAssignment extends Model
{
    use HasFactory;

    protected $table = 'route_assignments';

    protected $fillable = [
        'route_id',
        'guide',
        'guide2',
    ];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
