<?php

/**
 * ---------------------------------------------------
 *  Developed by: Jorge Méndez - Programandoweb
 *  Email: lic.jorgemendez@gmail.com
 *  Phone: 3115000926
 *  Website: Programandoweb.net
 *  Project: Ivoovle Inventory
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterialPaid extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_entries_id',
        'suppliers_id',
        'amount_paid',
    ];

    // Relación con el proveedor
    public function supplier()
    {
        return $this->belongsTo(Suppliers::class, 'suppliers_id');
    }

    // Relación con la entrada de inventario (InventoryEntries) para obtener el monto facturado
    public function inventoryEntry()
    {
        return $this->belongsTo(InventoryEntries::class, 'inventory_entries_id');
    }

    public function raw_material()
     {
         return $this->hasOne(InventoryEntries::class,'id', 'inventory_entries_id');
     }
}
