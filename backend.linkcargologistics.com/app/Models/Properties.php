<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Properties extends Model
{
    use HasFactory;

    public function owner()
    {
        return $this->belongsTo(PropertiesRelUser::class, 'property_id');
    }

    public function relation()
    {
        return $this->belongsTo(PropertiesRelUser::class);
    }
}
