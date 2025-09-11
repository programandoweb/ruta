<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',                    // Código único
        'master_ingredient_id',     // Relación con el ingrediente maestro
        'units_of_measurement_id',  // Relación con la unidad de medida
        'minimum_stock',            // Stock mínimo
    ]; 

     // Assuming the foreign key is 'unit_of_measure_id' and it references 'id' on the 'units_of_measurement' table
     public function units_of_measurement()
     {
         return $this->belongsTo(MasterTable::class, 'units_of_measurement_id');         
     }
 
     // Assuming the foreign key is 'default_supplier_id' and it references 'id' on the 'suppliers' table
     public function defaultSupplier()
     {
         return $this->belongsTo(Supplier::class, 'default_supplier_id');
     }
 
     public function inventory()
     {
         return $this->hasOne(InventoryEntries::class, 'product_id' ,'master_ingredient_id');
     }     
     
}
