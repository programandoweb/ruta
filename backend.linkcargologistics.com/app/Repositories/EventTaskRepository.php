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

use App\Models\EventTask;
use App\Models\Events;
use Illuminate\Http\Request;

class EventTaskRepository
{
    /**
     * Crea una nueva tarea validando la relación entre cliente y evento.
     */
    public function createWithRelations(array $data, $user): EventTask
    {
        // Validar que si se pasa event_id, exista
        if (!empty($data['event_id'])) {
            $event = Events::find($data['event_id']);
            if (! $event) {
                throw new \Exception('El evento no existe.');
            }

            if ((int) $event->user_id !== (int) $data['client_id']) {
                throw new \Exception('The client does not match the event owner.');
            }
        }

        //p($data);

        return EventTask::create([
            'client_id'    => $data['client_id'] ?? null,
            'provider_id'  => $user->customer_group_id ?? $user->id ?? null,
            'event_id'     => $data['event_id'] ?? null,
            'servicio_id'  => $data['servicio_id'] ?? null,
            'employee_id'  => $data['employee_id'] ?? null,
            'name'         => $data['name'],
            'description'  => $data['description'] ?? null,
            'start_date'   => $data['start_date'] ?? null,
            'due_date'     => $data['due_date'] ?? null,
            'status'       => $data['status'] ?? 'pendiente',
        ]);
    }


    /**
     * Obtiene los servicios (eventos + items) del usuario autenticado.
     */
    public function getServicios($user)
    {
        $query = Events::query();
        $query->select("id", "title as label");
        $query->with("items");

        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($user->hasRole('clients')) {
            $query->where('user_id', $user->id);
        } elseif ($user->hasRole('providers')) {
            $servicios = \App\Models\Servicios::where('user_id', $user->id)->pluck('id');
            $query->whereHas('items', function ($q) use ($servicios) {
                $q->whereIn('servicio_id', $servicios);
            });
        } else {
            $query->whereRaw('1 = 0');
        }

        return $query->get();
    }

    /**
     * Obtiene una tarea por ID si el usuario tiene acceso.
     */
    public function getByIdAndUser(string $id, $user): ?EventTask
    {
        $query = EventTask::with(['event', 'event.user', 'event.servicios']);

        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($user->hasRole('clients')) {
            $query->where('client_id', $user->id);
        } elseif ($user->hasRole('providers')) {
            $servicios = \App\Models\Servicios::where('user_id', $user->id)->pluck('id');
            $query->whereIn('servicio_id', $servicios);
        } else {
            return null;
        }

        return $query->where('id', $id)->first();
    }

    /**
     * Obtiene todas las tareas paginadas, con filtros según el rol.
     */
    public function getAll(Request $request, $select = false)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $user    = $request->user();
        $query   = EventTask::with(['event', 'event.user', 'event.servicios']);

        // Si se pasa un select (array de columnas), aplicarlo al query
        if ($select && is_array($select)) {
            $query->select($select);
        }

        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($user->hasRole('clients')) {
            $query->where('client_id', $user->id);
        } elseif ($user->hasRole('providers')||$user->hasRole('employees')||$user->hasRole('managers')) {
            $servicios = \App\Models\Servicios::where('user_id', $user->id)->pluck('id');
            //$query->whereIn('servicio_id', $servicios);
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    

    /**
     * Crea una tarea sin validación adicional (uso interno).
     */
    public function create(array $data): ?EventTask
    {
        return EventTask::create($data);
    }

    /**
     * Obtiene una tarea por ID.
     */
    public function findById(string $id): ?EventTask
    {
        return EventTask::with(['event', 'event.user', 'event.servicios'])->find($id);
    }

    /**
     * Actualiza una tarea existente.
     */
    public function update(string $id, array $data): ?EventTask
    {
        $task = EventTask::find($id);
        if ($task) {
            $task->update($data);
        }
        return $task;
    }

    /**
     * Elimina una tarea por ID.
     */
    public function delete(string $id): bool
    {
        $task = EventTask::find($id);
        return $task ? $task->delete() : false;
    }
}
