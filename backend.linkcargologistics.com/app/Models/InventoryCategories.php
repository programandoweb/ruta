<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InventoryItem;

class InventoryCategories extends Model
{
    use HasFactory;

    protected $table = 'inventory_categories';

    protected $fillable = [
        'name',
    ];

    public function items()
    {
        return $this->hasMany(InventoryItem::class, 'inventory_category_id');
    }
}
