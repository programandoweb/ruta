<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'opened_by','closed_by','opening_amount','closing_amount_expected',
        'closing_amount_real','opened_at','closed_at','status'
    ];

    public function movements() { return $this->hasMany(CashMovement::class); }
}
