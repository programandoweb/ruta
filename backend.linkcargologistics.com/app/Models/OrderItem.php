<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';
    protected $appends = ['paids'];


    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'category',
        'quantity',
        'price',
        'description',
        'subtotal',
        'status',
        'delete_by_id'
    ];

    /**
     * Relación con la orden
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // App\Models\OrderItem.php

    public function paids()
    {
        return $this->hasMany(OrderPaid::class, 'order_id', 'order_id')
            ->whereJsonContains('items', (string) $this->id);
    }

    // App\Models\OrderItem.php

    public function getPaidsAttribute()
    {
        return \App\Models\OrderPaid::where('order_id', $this->order_id)
            ->whereJsonContains('items', (string) $this->id)
            ->get();
    }



}
