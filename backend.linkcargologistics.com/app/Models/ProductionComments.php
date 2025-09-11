<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionComments extends Model
{
    use HasFactory;

    protected $fillable = [
        'note', 
        'production_order_id',
        'note',
        'step'
    ];
}
