<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreProducts extends Model
{
    protected $table = 'store_products';

    protected $fillable = [
        'name', 
        'content', 
        'content2', 
        'excerpt', 
        'price', 
        'slug', 
        'image', 
        'cover', 
        'featured', 
        'store_category_id', 
        'minimal_inventory', 
        'status_id',
        'cost',
        'code',
        'dataDinamic',
        'title',
        'gallery',
        'plans',
        'property_type',
        'parent_id'
    ];

    public function category()
    {
        return $this->belongsTo(StoreCategories::class, 'store_category_id');
    }

    public function ingredients()
    {
        return $this->hasMany(StoreProductsIngredient::class, 'store_product_id')->with(["raw","parent"]);
    }

    public function ingredients_inv()
    {
        return $this->hasMany(StoreProductsIngredient::class, 'store_product_id')->with(["parents_inv"]);
    }

    public function status()
    {
        return $this->belongsTo(MasterTable::class, 'status_id');
    }

    // Relación con el inventario o stock
    public function stock()
    {
        return $this->hasOne(ProductStock::class, 'store_product_id');
    }

    public function inventory()
    {
        return $this->hasMany(Inventory::class, 'product_id');
    }

    public function sales_items()
    {
        return $this->hasMany(SalesItems::class, 'product_id');
    }

    public function table_data_dinamics()
    {
        return $this->hasMany(StoreProductsDataDinamic::class, 'store_products_id');
    }
    

}
