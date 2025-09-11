<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Productos asociados a esta categoría
     */
    public function services()
    {
        return $this->hasMany(Servicios::class, 'product_category_id');
    }
}
