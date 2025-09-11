<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sales extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'sales';

    /**
     * Los atributos que son asignables.
     *
     * @var array
     */
    protected $fillable = [
        'reference_no',
        'customer_id',
        'total_quantity',
        'total_discount',
        'total_tax',
        'total_price',
        'grand_total',
        'order_tax_rate',
        'order_tax',
        'order_discount',
        'shipping_cost',
        'sale_status',
        'payment_status',
        'document',
        'paid_amount',
        'sale_note',
        'staff_note',
        'created_at',
        'updated_at'
    ];
        

    /**
     * Relación con el modelo `Customer` (presuntamente el modelo de clientes).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id')->with("credit");
    }

    public function payments()
    {
        return $this->hasMany(SalesPayments::class, "sale_id", "id");
    }

    public function items()
    {
        return $this->hasMany(SalesItems::class, "sale_id", "id")->with("product");
    }

    /**
     * Obtener la suma total de los créditos de un cliente.
     *
     * @return float
     */
    public function getTotalCreditAttribute(): float
    {
        // Verifica si el cliente está cargado y si tiene créditos
        if ($this->customer && $this->customer->relationLoaded('credit')) {
            return $this->customer->credit->sum('amount');
        }

        // Si no se ha cargado, retorna 0 o realiza otra lógica
        return 0;
    }
}
