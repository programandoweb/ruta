<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PwaSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'value',        
        'src',
        'sizes',
        'type',
        'label',
    ];

    // Si la tabla no contiene timestamps, puedes desactivarlos
    public $timestamps = false;

    // Si necesitas definir el casting de algunos atributos
    protected $casts = [
        'name' => 'string',
        'value' => 'string',
    ];
}
