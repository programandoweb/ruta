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

class ProductsItem extends Model
{
    use HasFactory;

    protected $table = 'products_items';

    protected $fillable = [
        'product_id',
        'inventory_item_id',
        'unit_id',
        'qty',
        'waste_pct',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function unit()
    {
        return $this->belongsTo(Units::class, 'unit_id');
    }
}
