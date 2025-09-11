<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreOrderItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'amount',
        'client_id',
        'store_orders_id',
        'store_products_id',
        'observation',
        'status',
        'variant_name'
    ];

    public function product()
    {
        return $this->hasOne(StoreProducts::class,'id','store_products_id')->with("ingredients");
    }
    
}
