<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Services;
use App\Models\ProductCategory;
use App\Models\Products;

class Servicios extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'product_category_id',
        'name',
        'description',
        'rating',
        'location',
        'gallery',
        'image',
        'contact_phone',
        'price',
        'map',
        'type',
        'service_id'
    ];

    protected $casts = [
        'gallery' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Services::class, 'category_id');
    }

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * Relación uno-a-uno con los datos específicos de Products
     */
    public function product()
    {
        return $this->hasOne(Products::class, 'servicio_id')->with("items");
    }
}
