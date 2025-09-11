<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_id',
        'client_id',
        'waiter_id',
        'cook_id',
        'cashier_id',
        'order_number',
        'total_amount',
        'status'
    ];

    public function items(){
        return $this->hasMany(StoreOrderItems::class,'store_orders_id','id')->with("product");
    }
    
    public function accountingEntries()
    {
        return $this->hasMany(AccountingEntries::class);
    }

    public function descriptionOrder(){
        return $this->hasMany(StoreOrderItems::class,'store_orders_id','id')->with("product");
    }


    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function cook()
    {
        return $this->belongsTo(User::class, 'cook_id');
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function waiter()
    {
        return $this->belongsTo(User::class, 'waiter_id');
    }

    public function table()
    {
        return $this->belongsTo(MasterTable::class, 'table_id');
    }

}
