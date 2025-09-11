<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryItem extends Model
{
    use HasFactory;

    protected $table = 'inventory_items';

    protected $fillable = [
        'sku',
        'name',
        'base_unit_id',
        'stock',
        'avg_cost',
        'inventory_categories_id'
        // 'user_id', // si usas multitenancy
    ];

    public function unit()
    {
        return $this->belongsTo(Units::class, 'base_unit_id');
    }

    public function movementItems()
    {
        return $this->hasMany(\App\Models\InventoryMovementItem::class, 'inventory_items_id');
    }

}
