<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicles extends Model
{
    use HasFactory;

    // Definir los campos fillable para la asignación masiva
    protected $fillable = [
        'owner_id',        // Relación con el propietario del vehículo (User)
        'license_plate',   // Placa del vehículo
        'make',            // Marca del vehículo
        'model',           // Modelo del vehículo
        'type',            // Tipo del vehículo
    ];

    // Relación con el modelo User
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id')->with('properties');
    }
}
