<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesItems extends Model
{
    use HasFactory;

    // Permitir asignación masiva para estos campos
    protected $fillable = [
        'sale_id',         // Clave foránea hacia la tabla de ventas
        'product_id',      // Clave foránea hacia la tabla de productos
        'quantity',        // Cantidad vendida
        'discount',        // Descuento aplicado al ítem
        'tax_rate',        // Tasa de impuestos
        'tax',             // Cantidad de impuestos calculados
        'total',           // Total de precio del ítem (cantidad * precio - descuentos)
        'variant_id',
    ];

    
    public function product()
    {
        return $this->belongsTo(StoreProducts::class, 'product_id');
    }
}
