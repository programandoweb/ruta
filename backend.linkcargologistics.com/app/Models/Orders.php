<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'business_id',
        'status',
        'scheduled_at',
        'total_price',
        'payment_method',
        'notes',
    ];

    // Relación con el usuario que creó la orden
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el negocio asociado a la orden
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Relación con los ítems de la orden
     */
    public function items()
    {
        // 👈 Aquí le decimos la foreign key explícita
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    // App\Models\Orders.php

    public function paids()
    {
        return $this->hasMany(OrderPaid::class, 'order_id');
    }

    // 👉 Accesor para total pagado
    public function getTotalPaidAttribute()
    {
        return $this->paids()->sum('amount');
    }

    // 👉 Accesor para saldo pendiente
    public function getRemainingAttribute()
    {
        return max(0, $this->total_price - $this->total_paid);
    }

}
