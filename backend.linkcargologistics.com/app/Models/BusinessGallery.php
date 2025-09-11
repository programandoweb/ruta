<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessGallery extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'business_galleries'; // Ensure the table name is explicitly set if it deviates from convention

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'image_path',
        'caption',
    ];

    /**
     * Get the business that owns the gallery image.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}