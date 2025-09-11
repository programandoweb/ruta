<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryExit extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'units_of_measurement_id',
        'exit_reason',
        'exit_date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function unitOfMeasurement()
    {
        return $this->belongsTo(UnitOfMeasurement::class, 'units_of_measurement_id');
    }
}
