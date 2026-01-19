<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'parent_id',
        'mensaje',
        'type',
        'status',
        'image',
        'modulo_token',
        'pathname',
        'json',
        'visible',
        'user_id',
    ];

    /**
     * 🔹 Cast automático para JSON
     */
    protected $casts = [
        'json' => 'array',
        'visible' => 'boolean',
    ];

    /**
     * 🔹 Autor del comentario
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 🔹 Comentario padre
     */
    public function parent()
    {
        return $this->belongsTo(Comments::class, 'parent_id');
    }

    /**
     * 🔹 Respuestas del comentario
     */
    public function children()
    {
        return $this->hasMany(Comments::class, 'parent_id');
    }

    /**
     * 🔹 Comentarios pendientes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * 🔹 Filtrar por tipo
     */
    public function scopeType($query, $type)
    {
        if (!empty($type)) {
            return $query->where('type', $type);
        }
        return $query;
    }

    /**
     * 🔹 Búsqueda general
     */
    public function scopeSearch($query, $term)
    {
        if (!empty($term)) {
            $query->where(function ($q) use ($term) {
                $q->where('mensaje', 'like', "%{$term}%")
                  ->orWhere('modulo_token', 'like', "%{$term}%")
                  ->orWhere('pathname', 'like', "%{$term}%");
            });
        }
        return $query;
    }
}
