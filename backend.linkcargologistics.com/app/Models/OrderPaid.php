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

class OrderPaid extends Model
{
    use HasFactory;

    protected $table = 'order_paids';

    protected $fillable = [
        'order_id',
        'user_id',
        'table_id',
        'amount',
        'method',
        'note',
        'items',
    ];

    protected $casts = [
        'items' => 'array', // convierte el JSON en array automáticamente
    ];

    // 👉 Relación con la orden
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    // 👉 Relación con el usuario que registró el pago
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 👉 Helper para obtener los ítems pagados (si se guardan en "items" como IDs)
    public function paidItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id')
            ->whereIn('id', $this->items ?? []);
    }
}
