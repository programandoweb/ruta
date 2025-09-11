<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryEntries extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_id',
        'quantity',
        'units_of_measurement_id',
        'entry_type',
        'suppliers_id',
        'expiry_date',
        'cost',
        'production_orders_id'
    ];

    // Relación con el modelo MasterTable como producto
    public function product()
    {
        return $this->belongsTo(MasterTable::class, 'product_id')->select('id', 'label');
    }

    // Relación con la tabla de unidades de medida
    public function unitOfMeasurement()
    {
        return $this->belongsTo(MasterTable::class, 'units_of_measurement_id')->select('id', 'label');
    }
    

    // Relación con la tabla master_tables para obtener información del producto
    public function raw()
    {
        return $this->hasOne(MasterTable::class, 'id', 'product_id')->select("id", "label","medida_id")->with("medida");
    }

    // Relación con los pagos asociados (RawMaterialPaid)
    public function paids()
    {
        return $this->hasMany(RawMaterialPaid::class, 'inventory_entries_id', 'id');
    }

    public function suppliers()
    {
        return $this->hasOne(Suppliers::class, 'id', 'suppliers_id');
    }

    public function rawMaterial()
    {
        return $this->hasOne(MasterTable::class, 'id', 'product_id')->select("id", "label");
    }

    // Relación con todos los pagos asociados a esta entrada de inventario
    public function paidAmounts()
    {
        return $this->hasMany(RawMaterialPaid::class, 'inventory_entries_id');
    }
}
