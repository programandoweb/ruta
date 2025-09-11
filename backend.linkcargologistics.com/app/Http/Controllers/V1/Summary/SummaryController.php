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

namespace App\Http\Controllers\V1\Summary;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\EventRepository;
use App\Repositories\ServiciosRepository;
use App\Models\CalendarSlots;
use Carbon\Carbon;

class SummaryController extends Controller
{
    protected $eventRepository;
    protected $serviciosRepository;

    public function __construct(EventRepository $eventRepository, ServiciosRepository $serviciosRepository)
    {
        $this->eventRepository     = $eventRepository;
        $this->serviciosRepository = $serviciosRepository;
    }

    /**
     * Retorna el resumen para el dashboard.
     */
    public function summary(Request $request)
    {
        try {
            $authUser = auth()->user();
            if (!$authUser) {
                return response()->error("No autenticado", 401);
            }

            // Determinar providerId: empleados usan customer_group_id; si no, el id del usuario
            if ($authUser->hasRole('employees')) {
                if (!$authUser->customer_group_id) {
                    return response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400);
                }
                $providerId = $authUser->customer_group_id;
            } else {
                $providerId = $authUser->id;
            }

            // Total citas del proveedor
            $totalAppointments = CalendarSlots::where('provider_id', $providerId)->count();

            // Total citas de hoy del proveedor
            $todayDate = Carbon::today()->toDateString();
            $todayAppointments = CalendarSlots::where('provider_id', $providerId)
                ->where('date', $todayDate)
                ->count();

            // Total eventos activos
            $events = $this->eventRepository->getAll($request);

            // Total servicios del proveedor usando getMeServices()
            $services = $this->serviciosRepository->getMeServices($providerId);
            $totalServices = $services->count();

            return response()->success([
                'active_events'      => $events->total() ?? 0,
                'total_appointments' => $totalAppointments,
                'today_appointments' => $todayAppointments,
                'total_services'     => $totalServices,
            ]);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
