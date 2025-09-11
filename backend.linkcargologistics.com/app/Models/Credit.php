<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Asegúrate de importar el modelo User

class Credit extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'approver_id',
        'amount',
    ];

    // Relación con el usuario aprobador del crédito
    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    // Relación con el cliente que recibe el crédito
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
