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

use App\Models\Business;
use App\Models\Events;
use App\Models\EventItems;
use Carbon\Carbon;


class EventRepository
{

    /**
     * Retorna todos los eventos paginados, opcionalmente filtrados.
     */
    public function getAll($request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $user    = $request->user();
        $query   = Events::query();

        // Seleccionar solo campos específicos (excluyendo created_at y updated_at)
        $query->select('id', 'user_id', 'title', 'event_date', 'budget', 'guests', 'notes');

        // Filtro por roles
        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($user->hasRole('clients')) {
            $query->where('user_id', $user->id);
        } elseif ($user->hasRole('providers')) {
            $businessIds = \App\Models\Business::where('user_id', $user->id)->pluck('id');            
            $servicios = \App\Models\Servicios::where('user_id', $user->id)->pluck('id');            
            $query->whereHas('items', function ($q) use ($businessIds,$servicios) {
                //$q->whereIn('business_id', $businessIds);
                $q->whereIn('servicio_id', $servicios);
            });            
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function addItem($id, $request)
    {
        
        // Validar entrada
        $validated = $request->all();

        $notes = $request->input('notes');

        // Evita duplicados usando firstOrCreate
        $item = EventItems::firstOrCreate(
            [
                'event_id'    => $id,
                'servicio_id' => $request->input('servicio_id'),
            ],
            [
                'quantity' => 1,
                'notes'    => $notes??null,
            ]
        );

        return $item;
    }



    public function removeItem($id, $request)
    {
        return EventItems::where('id', $request->itemId)->delete();
    }



    /**
     * Crea un nuevo evento.
     */
    public function create(array $data): ?Events
    {
        return Events::create($data);
    }

    /**
     * Retorna un evento por su ID, con sus ítems asociados.
     */
    public function findById(string $id): ?Events
    {
        return Events::with(['items.business','items.servicio'])->find($id);
    }

    /**
     * Actualiza un evento existente.
     */
    public function update(string $id, array $data): ?Events
    {
        $event = Events::find($id);
        if ($event) {
            $event->update($data);
        }
        return $event;
    }

    /**
     * Elimina un evento por ID.
     */
    public function delete(string $id): bool
    {
        $event = Events::find($id);
        return $event ? $event->delete() : false;
    }

    public function lastEventByUser(int $userId): ?Events
    {
        return Events::where('user_id', $userId)
            ->whereDate('event_date', '>=', Carbon::today()->toDateString())
            ->orderBy('event_date', 'desc')
            ->first();
    }

    
}
