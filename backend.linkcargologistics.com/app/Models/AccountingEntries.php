<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingEntries extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'transaction_type',
        'description',
        'amount',
        'transaction_date',
        'created_by_users_id',
    ];

    public function order()
    {
        return $this->belongsTo(StoreOrder::class);
    }
}
