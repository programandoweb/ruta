<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreProductsIngredient extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'quantity',
        'type',                   // Campo 'type' (enum con 'raw' o 'variant')
        'variant_name',           // Nombre de la variante (si aplica)
        'variant_code',           // Código de la variante (si aplica)
        'variant_price',          // Precio de la variante (si aplica)
        'store_product_id',
        'ingredient_id',
        'units_of_measurement_id',
        'variant_id',
    ];

    /**
     * Relación con la tabla master_tables para la unidad de medida.
     */
    public function units_of_measurement()
    {
        return $this->belongsTo(MasterTable::class, 'units_of_measurement_id');
    }
    

    /**
     * Relación con la tabla store_products.
     */
    public function store_product()
    {
        return $this->belongsTo(StoreProduct::class, 'store_product_id');
    }

    /**
     * Relación con la tabla master_tables para los ingredientes.
     */
    public function raw()
    {
        return $this->belongsTo(MasterTable::class, 'ingredient_id')->with("inventory")->with("medida");
    }


    // Relación con la categoría
    public function category()
    {
        return $this->belongsTo(StoreCategories::class, 'store_category_id');
    }

    // Relación con inventario
    public function inventory()
    {
        return $this->hasOne(InventoryEntries::class,'product_id', 'ingredient_id');
    }

    public function inventory_now()
    {
        return $this->hasOne(InventoryEntries::class,'product_id', 'ingredient_id');
    }

    public function parent()
    {
        return $this->hasOne(StoreProductsIngredient::class,'id', 'variant_id');
    }

    public function parents_inv()
    {
        return $this->hasMany(StoreProductsIngredient::class,'variant_id', 'id');
    }

    public function child()
    {
        return $this->hasMany(StoreProductsIngredient::class,'variant_id', 'id');
    }

    


}
