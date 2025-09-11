<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'user_id',
        'provider_id',
        'client_id',
        'reference',
        'movement_date',
        'note',
    ];

    public function items()
    {
        return $this->hasMany(InventoryMovementItem::class, 'inventory_movement_id');
    }
    public function user()     { return $this->belongsTo(User::class); }
    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }

}
