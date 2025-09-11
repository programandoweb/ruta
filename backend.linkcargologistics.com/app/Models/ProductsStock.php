<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsStock extends Model
{
    use HasFactory;

    protected $table = 'products_stocks';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'note',
        'stocked_at',
    ];

    /**
     * Relaciones
     */
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
