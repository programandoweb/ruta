<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables de forma masiva.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'quantity',
        'batch_number',
        'cost',
        'price',
        'selling_price',
        'production_orders_id',
        'variant_id'
    ];

    public function product()
    {
        return $this->belongsTo(StoreProducts::class, 'product_id')->with(['ingredients' => function($query) {
            $query->where('type', 'variant');
        }]);
    }


}
