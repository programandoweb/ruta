<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Servicios;
use App\Models\ProductsItem;
use App\Models\ProductCategory;
use App\Models\User;

class Products extends Model
{
    use HasFactory;

    protected $fillable = [
        'servicio_id',
        'name',
        'barcode',
        'brand',
        'measure_unit',
        'measure_quantity',
        'short_description',
        'long_description',
        'product_category_id',
        'stock_control',
        'stock_current',
        'stock_alert_level',
        'stock_reorder_amount',
        'stock_notifications_enabled',
        'model',
        'color',
        'sku',
        'stock',
        'min_stock',
        'price',
        'provider_id',
        'gallery',
        'cost'
    ];

    // App\Models\Products.php

    protected $casts = [
        'gallery' => 'array',
    ];


    /**
     * Servicio principal al que pertenece este producto
     */
    public function servicio()
    {
        return $this->belongsTo(Servicios::class, 'servicio_id');
    }
    

    /**
     * Ítems relacionados con este producto
     */
    public function items()
    {
        return $this->hasMany(ProductsItem::class, 'product_id')->with(['inventoryItem']);
    }

    /**
     * Categoría a la que pertenece el producto
     */
    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * Proveedor (usuario) asociado al producto
     */
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
