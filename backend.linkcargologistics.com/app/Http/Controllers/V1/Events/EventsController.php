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
use App\Repositories\EventRepository;
use App\Repositories\ServiciosRepository;

class EventsController extends Controller
{
    protected $eventRepository;
    protected $serviciosRepository;

    public function __construct(ServiciosRepository $serviciosRepository,EventRepository $eventRepository)
    {
        $this->serviciosRepository  = $serviciosRepository;
        $this->eventRepository = $eventRepository;
    }

    public function index(Request $request)
    {
        try {
            $events = $this->eventRepository->getAll($request);
            return response()->success(compact('events'), 'Listado de eventos');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'      => 'required|string|max:255',
                'event_date' => 'nullable|date',
                'budget'     => 'nullable|numeric|min:0',
                'guests'     => 'nullable|integer|min:1',
                'notes'      => 'nullable|string',
            ]);

            $validated['user_id'] = $request->user()->id;

            $event = $this->eventRepository->create($validated);
            return response()->success(compact('event'), 'Evento creado exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $event = $this->eventRepository->findById($id);

            if (! $event&&$id!='new') {
                return response()->error('Evento no encontrado', 404);
            }

            /**
             * Incluimos los servicios
             */
            $services   =   $this->serviciosRepository->getServicios();

            return response()->success(compact('event','services'), 'Evento encontrado 2025');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'title'      => 'sometimes|required|string|max:255',
                'event_date' => 'nullable|date',
                'budget'     => 'nullable|numeric|min:0',
                'guests'     => 'nullable|integer|min:1',
                'notes'      => 'nullable|string',
            ]);

            $event = $this->eventRepository->update($id, $validated);

            if (! $event) {
                return response()->error('Evento no encontrado', 404);
            }

            return response()->success(compact('event'), 'Evento actualizado');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->eventRepository->delete($id);

            if (! $deleted) {
                return response()->error('Evento no encontrado', 404);
            }

            return response()->success([], 'Evento eliminado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function addItem(string $id, Request $request)
    {
        $userId = auth()->id();
        if (! $userId) {
            return response()->error('No autenticado', 401);
        }

        // Obtener último evento activo del usuario
        $event = $this->eventRepository->lastEventByUser($userId);
        if (! $event) {
            return response()->error('No hay evento activo para asignar ítems', 404);
        }
         
        // Obtener id del negocio 
        $servicio = $this->serviciosRepository->findById($request->newServiceId);
        if (! $servicio) {
            return response()->error('No hay servicio activo para asignar ítems', 404);
        }
        
        // Inyectar en el request el título del evento como notas
        $request->merge([
            'notes' => $event->title,
            'servicio_id' => $servicio->id,
        ]);

        // Agregar el ítem usando el ID real del evento
        $this->eventRepository->addItem($event->id, $request);

        // Devolver la vista del evento actualizado
        return $this->show($event->id);
    }



    public function removeItem(string $id, Request $request)
    {
        try {
            $this->eventRepository->removeItem($id, $request);
            return $this->show($id);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function acceptItem(string $id, Request $request)
    {
        try {
            // Buscar el item por ID dentro del evento especificado
            $item = \App\Models\EventItems::where('id', $request->itemId)
                ->where('event_id', $id)
                ->first();

            if (! $item) {
                return response()->error('Ítem no encontrado', 404);
            }

            if ($item->status === 'aceptado') {
                return response()->error('El ítem ya está aceptado', 400);
            }

            // Cambiar el status a 'aceptado' para bloquear el ítem
            $item->update(['status' => 'aceptado']);

            // Retornar el evento actualizado
            return $this->show($id);
            
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

}
