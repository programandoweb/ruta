<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'unit',
        'is_active',
        'contact_phone',
        'contact_email',
        'whatsapp_link',
        'location',
        'category_id',
        'image',
        'allow_comments',
        'allow_location',
    ];

    protected $casts = [
        'is_active'        => 'boolean',
        'allow_comments'   => 'boolean',
        'allow_location'   => 'boolean',
        'price'            => 'decimal:2',
    ];

    // Relación con el usuario propietario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con la categoría (opcional)
    public function category()
    {
        return $this->belongsTo(Service::class, 'category_id');
    }
}
