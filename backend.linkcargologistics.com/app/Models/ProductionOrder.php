<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrder extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables de forma masiva.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'variant_id',
        'quantity',
        'status',
        'user_id',
        'cost', 
        'price'       
    ];

    public function inventory()
    {
        return $this->hasMany(InventoryEntries::class,"production_orders_id","id")
                    ->select("cost","id","expiry_date","quantity","production_orders_id","product_id")
                    ->with("raw");
    }

    public function comments()
    {
        return $this->hasMany(ProductionComments::class,"production_order_id","id");
    }

    public function checklist()
    {
        return $this->hasMany(ProductionOrderCheckList::class,"production_order_id","id");
    }
    
}
