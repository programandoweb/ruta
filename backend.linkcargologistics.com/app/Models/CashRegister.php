<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashRegister extends Model
{
    use HasFactory;

    protected $fillable = [
        'cash_register_id',
        'user_operator_id',
        'open_authorized_by_id',
        'close_authorized_by_id',
        'opening_date',
        'opening_time',
        'closing_time',
        'opening_balance',
        'closing_balance',
        'notes',
        'status',
    ];
}
