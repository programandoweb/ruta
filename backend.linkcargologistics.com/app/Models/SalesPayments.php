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

class SalesPayments extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_reference',
        'customer_id',
        'purchase_id',
        'sale_id',
        'cash_register_id',
        'credit_id',
        'amount',
        'paying_method',
        'payment_note'
    ];

    // Relación con el cliente
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    // Relación con la venta
    public function sale()
    {
        return $this->belongsTo(Sales::class, 'sale_id')->with('payments')->withSum('payments', 'amount');
    }

    // Relación con la compra de materia prima
    public function purchase()
    {
        return $this->belongsTo(InventoryEntries::class, 'purchase_id');
    }

    // Relación con la caja registradora
    public function cashRegister()
    {
        return $this->belongsTo(MasterTable::class, 'cash_register_id');
    }

    // Relación con el crédito
    public function credit()
    {
        return $this->belongsTo(Credits::class, 'credit_id');
    }
}
