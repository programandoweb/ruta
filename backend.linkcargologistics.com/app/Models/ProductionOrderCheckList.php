<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrderCheckList extends Model
{
    use HasFactory;
    
    protected $fillable = ['production_order_id', 'step', 'note'];

    public function comments()
    {
        return $this->hasMany(ProductionComments::class,"production_order_id","id");
    }
}
