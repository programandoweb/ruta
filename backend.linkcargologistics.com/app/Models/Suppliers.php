<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tax_id',
        'category',
        'contact_name',
        'contact_email',
        'contact_phone',
        'address',
        'raw_materials'
    ];

    protected $casts = [
        'category' => 'string', // Opcional, dependiendo de tu uso
    ];
    
}
