<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class InventoryMovementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_movement_id',
        'inventory_items_id',
        'quantity',
        'unit_cost',
        'location',
    ];

    public function movement()
    {
        return $this->belongsTo(InventoryMovement::class, 'inventory_movement_id');
    }

    public function product()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_items_id');
    }
    
}
