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

namespace App\Repositories;

use App\Models\CalendarAvailabilities;

class CalendarAvailabilitiesRepository
{
    /**
     * Obtener disponibilidad por proveedor
     */
    public function getByProvider(int $providerId)
    {
        return CalendarAvailabilities::where('provider_id', $providerId)
            ->orderBy('weekday')
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Crear una nueva franja de disponibilidad
     */
    public function create(array $data)
    {
        return CalendarAvailabilities::create($data);
    }

    /**
     * Eliminar toda la disponibilidad de un proveedor
     */
    public function deleteByProvider(int $providerId)
    {
        return CalendarAvailabilities::where('provider_id', $providerId)->delete();
    }
}
