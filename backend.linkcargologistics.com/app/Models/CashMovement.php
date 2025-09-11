<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashMovement extends Model
{
    use HasFactory;

    protected $fillable = ['cash_shift_id','type','amount','method','reference','note'];

    public function shift() { return $this->belongsTo(CashShift::class); }
}
