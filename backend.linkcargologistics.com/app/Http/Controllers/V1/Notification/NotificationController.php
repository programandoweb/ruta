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

namespace App\Http\Controllers\V1\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\NotificationRepository;
use App\Repositories\ServiciosRepository;

class NotificationController extends Controller
{
    protected $notificationRepository;
    protected $serviciosRepository;

    public function __construct(ServiciosRepository $serviciosRepository, NotificationRepository $notificationRepository)
    {
        $this->serviciosRepository      =   $serviciosRepository;
        $this->notificationRepository   =   $notificationRepository;
    }

    public function index(Request $request)
    {
        try {
            $notifications = $this->notificationRepository->getAll($request);
            return response()->success(compact('notifications'), 'Listado de notificaciones');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'to_user_id'   => 'required|integer|exists:users,id',
                'concepto'     => 'required|string|max:255',
                'descripcion'  => 'nullable|string',
                'tipo'         => 'nullable|string|max:100',
                'related_type' => 'nullable|string|max:100',
                'status'       => 'nullable|in:no leido,leido',
            ]);

            $validated['from_user_id'] = $request->user()->id ?? null;

            $notification = \App\Models\Notification::firstOrCreate(
                [
                    'to_user_id'    => $validated['to_user_id'],
                    'concepto'      => $validated['concepto'],
                    'tipo'          => $validated['tipo'] ?? null,
                    'related_type'  => $validated['related_type'] ?? null,
                ],
                [
                    'from_user_id'  => $validated['from_user_id'],
                    'descripcion'   => $validated['descripcion'] ?? null,
                    'status'        => $validated['status'] ?? 'no leido',
                ]
            );

            return response()->success(compact('notification'), 'Notificación creada o recuperada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $notification = $this->notificationRepository->findById($id);

            if (! $notification) {
                return response()->error('Notificación no encontrada', 404);
            }

            $schedule                       =   \App\Models\EventSchedule::where('id', $notification->related_type)->first(); 

            $notification->scheduled_at     =   $schedule->scheduled_at;
            

            return response()->success(compact('notification'), 'Detalle de la notificación');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'status'       => 'sometimes|in:no leido,leido',
                'concepto'     => 'sometimes|string|max:255',
                'descripcion'  => 'nullable|string',
                'tipo'         => 'nullable|string|max:100',
                'related_type' => 'nullable|string|max:100',                
            ]);

            $validated["status"]    =   "leido";

            $notification   =   $this->notificationRepository->update($id, $validated);

            if (! $notification) {
                return response()->error('Notificación no encontrada', 404);
            }

            //p($request->has("scheduled_at"));

            $schedule = false;

            if ($request->has("scheduled_at")) {
                \App\Models\EventSchedule::where('id', $notification->related_type)->update(['scheduled_at' => $request->scheduled_at,"status"=>"agendada"]);

                // Obtener al cliente desde la tabla event_schedules
                $schedule = \App\Models\EventSchedule::where('id', $notification->related_type)->first();                
            }   
            
            if ($schedule && $schedule->client_id) {
                
                // Crear nueva notificación al cliente informando que la fecha fue asignada o modificada
                \App\Models\Notification::firstOrCreate(
                    [
                        'to_user_id'    => $schedule->client_id,
                        'concepto'      => 'Fecha asignada o modificada para tu cita',
                        'tipo'          => 'cita',
                        'related_type'  => $notification->related_type,
                    ],
                    [
                        'from_user_id'  => $request->user()->id,
                        'descripcion'   => 'Se ha actualizado la fecha de tu cita',
                        'status'        => 'no leido',
                    ]
                );
            }

            return response()->success(compact('notification'), 'Notificación actualizada y cliente notificado');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function destroy(string $id)
    {
        try {
            $deleted = $this->notificationRepository->delete($id);

            if (! $deleted) {
                return response()->error('Notificación no encontrada', 404);
            }

            return response()->success([], 'Notificación eliminada correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
