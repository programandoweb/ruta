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

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'customer_name',
        'table_id',       // 👈 corregido (antes mesa_id)
        'status',
        'scheduled_at',
        'total_price',
        'payment_method',
        'notes',
        'code'
    ];

    /**
     * Relación con los ítems de la orden
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function itemsSales()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relación con el usuario que creó la orden
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
