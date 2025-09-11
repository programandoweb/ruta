<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreCategories extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'excerpt',
        'content',
        'image',
        'cover',
        'status_id',
    ];

    public function status()
    {
        return $this->belongsTo(MasterTable::class, 'status_id');
    }

    public function products()
    {
        return $this->hasMany(StoreProducts::class,'store_category_id','id');
    }


}
