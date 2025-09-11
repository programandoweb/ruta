<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Events;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\EventTaskRepository;
use App\Models\User;

class EventTasksController extends Controller
{
    protected $eventTaskRepository;

    public function __construct(EventTaskRepository $eventTaskRepository)
    {
        $this->eventTaskRepository = $eventTaskRepository;
    }

    public function index(Request $request)
    {
        try {
            $tasks = $this->eventTaskRepository->getAll($request, [
                \DB::raw('id'),
                \DB::raw('name AS Nombre'),
                \DB::raw('description AS Descripción'),
                \DB::raw('start_date AS "Fecha de inicio"'),
                \DB::raw('due_date AS "Fecha límite"'),
                \DB::raw('status AS Estado'),
            ]);
            return response()->success(compact('tasks'), 'Listado de tareas de eventos');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function store(Request $request)
    {
        try {
            // Convertir cadenas vacías a null
            $input = collect($request->all())->map(function ($value) {
                return $value === '' ? null : $value;
            })->toArray();

            $validated = validator($input, [
                'client_id'    => 'nullable|exists:users,id',
                'employee_id'  => 'nullable|exists:users,id',
                'event_id'     => 'nullable|exists:events,id',
                'servicio_id'  => 'nullable|exists:servicios,id',
                'name'         => 'required|string|max:255',
                'description'  => 'nullable|string',
                'start_date'   => 'nullable|date',
                'due_date'     => 'nullable|date|after_or_equal:start_date',
                'status'       => 'nullable|in:pendiente,en_progreso,completada,cancelada',
            ])->validate();

            $task = $this->eventTaskRepository->createWithRelations($validated, $request->user());

            return response()->success(compact('task'), 'Tarea creada exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function show(Request $request, string $id)
    {
        try {

            $authUser = auth()->user();
            if (!$authUser) {
                return response()->error("No autenticado", 401);
            }

            // Determinar providerId real: si el usuario es empleado, usar su customer_group_id; si no, su id.
            if ($authUser->hasRole('employees')||$authUser->hasRole('managers')) {
                if (!$authUser->customer_group_id) {
                    return response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400);
                }
                $providerId = $authUser->customer_group_id;
            } else {
                $providerId = $authUser->id;
            }
            
            $task = $this->eventTaskRepository->findById($id);

            if (! $task && $id!='new') {
                return response()->error('Tarea no encontrada', 404);
            }

             // Traer empleados: el proveedor o empleados asociados al proveedor
            $employees = User::select('id')
                ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                ->where(function($q) use ($providerId) {
                    $q->where('id', $providerId)
                    ->orWhere(function($q2) use ($providerId) {
                        $q2->where('customer_group_id', $providerId)
                            ->whereHas('roles', fn($q3) => $q3->where('name', 'employees'))
                            ->orWhereHas('roles', fn($q3) => $q3->where('name', 'managers'));
                    });
                })
                ->get();

            $servicios = $this->eventTaskRepository->getServicios($request->user());

            return response()->success(compact('task','servicios','employees'), 'Tarea encontrada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'client_id'    => 'nullable|exists:users,id',
                'event_id'     => 'nullable|exists:events,id',
                'servicio_id'  => 'nullable|exists:servicios,id',
                'name'         => 'sometimes|required|string|max:255',
                'description'  => 'nullable|string',
                'start_date'   => 'nullable|date',
                'due_date'     => 'nullable|date|after_or_equal:start_date',
                'status'       => 'nullable|in:pendiente,en_progreso,completada,cancelada',
            ]);

            $task = $this->eventTaskRepository->update($id, $validated);

            if (! $task) {
                return response()->error('Tarea no encontrada', 404);
            }

            return response()->success(compact('task'), 'Tarea actualizada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->eventTaskRepository->delete($id);

            if (! $deleted) {
                return response()->error('Tarea no encontrada', 404);
            }

            return response()->success([], 'Tarea eliminada correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
