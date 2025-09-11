<?php
/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Calendar;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\CalendarAvailabilitiesRepository;
use App\Models\CalendarSlots;
use App\Models\Servicios;
use Carbon\Carbon;
use App\Models\User;
use App\Repositories\ProductsRepository;


class CalendarAvailabilitiesController extends Controller
{
    protected $calendarRepository;
    protected $productsRepository;

    public function __construct(    ProductsRepository $productsRepository,
                                    CalendarAvailabilitiesRepository $calendarRepository)
    {
        $this->calendarRepository   = $calendarRepository;
        $this->productsRepository   = $productsRepository;
    }

    /**
     * Actualizar el estado y guardar el resumen de atención para un slot específico
     */
    public function updateAttention(Request $request, $slotId)
    {
        try {
            $authUser = auth()->user();
            if (!$authUser) {
                return response()->error("No autenticado", 401);
            }

            // Determinar providerId: si el usuario es empleado, usamos su customer_group_id
            if ($authUser->hasRole('employees')||$authUser->hasRole('managers')) {
                if (!$authUser->customer_group_id) {
                    return response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400);
                }
                $providerId = $authUser->customer_group_id;
            } else {
                $providerId = $authUser->id;
            }

            // Buscar el slot perteneciente al provider determinado
            $slot = CalendarSlots::where('id', $slotId)
                ->where('provider_id', $providerId)
                ->first();

            if (!$slot) {
                return response()->error("Cita no encontrada o no pertenece a este proveedor. 2025", 404);
            }

            // Validar datos recibidos
            $validated = $request->validate([
                'status' => 'required|in:pendiente,atendida,cancelada',
                'notes'  => 'nullable|string|max:2000',
            ]);

            // Actualizar estado del slot
            $slot->status = $validated['status'];
            $slot->save();
            //p($validated);
            // Crear o actualizar el resumen en calendar_slot_attentions
            \App\Models\CalendarSlotAttention::updateOrCreate(
                ['slot_id' => $slot->id],
                [
                    'status' => $validated['status'],
                    'notes'  => $validated['notes'] ?? '',
                ]
            );


            return response()->success([], "Estado y resumen de atención actualizados correctamente");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    /**
     * Obtener los detalles de un slot específico por ID con sus relaciones
     */
    public function calendar_slots_by_id(Request $request, $id)
    {
        try {
            $authUser = auth()->user();
            if (!$authUser) {
                return response()->error("No autenticado", 401);
            }

            // Determinar providerId: si el usuario es empleado, usamos su customer_group_id
            if ($authUser->hasRole('employees')||$authUser->hasRole('managers')) {
                if (!$authUser->customer_group_id) {
                    return response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400);
                }
                $providerId = $authUser->customer_group_id;
            } else {
                $providerId = $authUser->id;
            }

            // Buscar el slot perteneciente al proveedor determinado
            $slot = CalendarSlots::with(['client:id,name,email', 'provider:id,name,email', 'employee:id,name,email','event_orders'])
                ->where('provider_id', $providerId)
                ->where('id', $id)
                ->first();

            if (!$slot) {
                return response()->error("Cita no encontrada o no pertenece a este proveedor.", 404);
            }

            $products = $this->productsRepository->get($providerId);

            return response()->success(compact('slot','products'), "Citas y disponibilidad cargadas by_id");            
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Listar disponibilidad del usuario autenticado
     */
    public function index(Request $request)
    {
        try {
            $providerId = auth()->id();
            if (!$providerId) {
                return response()->error("No autenticado", 401);
            }

            $availabilities = $this->calendarRepository->getByProvider($providerId);

            return response()->success(compact('availabilities'), "Disponibilidad cargada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Crear nuevas franjas de disponibilidad para el usuario autenticado
     */
    public function store(Request $request)
    {
        try {
            $providerId = auth()->id();
            if (!$providerId) {
                return response()->error("No autenticado", 401);
            }

            $validated = $request->validate([
                'availability' => 'required|array',
                'availability.*.weekday' => 'required|integer|min:1|max:7',
                'availability.*.start' => 'required|date_format:H:i',
                'availability.*.end'   => 'required|date_format:H:i|after:availability.*.start',
            ]);

            $this->calendarRepository->deleteByProvider($providerId);

            foreach ($validated['availability'] as $slot) {
                $this->calendarRepository->create([
                    'provider_id' => $providerId,
                    'weekday'     => $slot['weekday'],
                    'start_time'  => $slot['start'],
                    'end_time'    => $slot['end'],
                    'status'      => 'activo',
                ]);
            }

            return response()->success([], "Disponibilidad actualizada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Eliminar toda la disponibilidad del usuario autenticado
     */
    public function destroy()
    {
        try {
            $providerId = auth()->id();
            if (!$providerId) {
                return response()->error("No autenticado", 401);
            }

            $this->calendarRepository->deleteByProvider($providerId);

            return response()->success([], "Disponibilidad eliminada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function calendar_slots(Request $request)
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

            // Obtener las citas del proveedor determinado
            $slots = \App\Models\CalendarSlots::with(['client:id,name,email','provider:id,name,email','employee:id,name,email'])
                ->where('provider_id', $providerId)
                ->orderBy('date')
                ->orderBy('start_time')
                ->get();

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

            // Clientes disponibles con rol 'clients'
            $clients = User::select('id')
                ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'clients');
                })
                ->get();

            // Disponibilidades configuradas para el provider
            $availabilities = \App\Models\CalendarAvailabilities::select('id', 'weekday', 'start_time', 'end_time', 'status')
                ->where('provider_id', $providerId)
                ->orderBy('weekday')
                ->orderBy('start_time')
                ->get();

            return response()->success(compact('slots', 'employees', 'clients', 'availabilities'), "Citas y disponibilidad cargadas slots");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Listar citas (slots reservados) del proveedor autenticado
     */
    public function calendar_slots2(Request $request)
    {
        try {
            $providerId = auth()->id();
            if (!$providerId) {
                return response()->error("No autenticado", 401);
            }



            // Obtener las citas del proveedor autenticado
            $slots = \App\Models\CalendarSlots::with(['client:id,name,email','provider:id,name,email','employee:id,name,email'])
                ->where('provider_id', $providerId)
                ->orderBy('date')
                ->orderBy('start_time')
                ->get();

            // Traer empleados con rol 'employees' asociados al proveedor
             $employees = User::select('id')
                    ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                    ->where(function($q) use ($providerId) {
                        $q->where('id', $providerId)
                        ->orWhere(function($q2) use ($providerId) {
                            $q2->where('customer_group_id', $providerId)
                                ->whereHas('roles', fn($q3) => $q3->where('name', 'employees'));
                        });
                    })
                    ->get();

            // Traer clientes disponibles en el sistema
            $clients = \App\Models\User::select('id')
                ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'clients');
                })
                ->get();

            // Traer disponibilidad configurada para el proveedor autenticado
            $availabilities = \App\Models\CalendarAvailabilities::select('id', 'weekday', 'start_time', 'end_time', 'status')
                ->where('provider_id', $providerId)
                ->orderBy('weekday')
                ->orderBy('start_time')
                ->get();

            return response()->success(compact('slots', 'employees', 'clients', 'availabilities'), "Citas y disponibilidad cargadas");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Asignar un empleado a una cita del calendario del proveedor autenticado
     * Este método se usa para CREAR nuevas citas.
     */
    public function assignEmployeeToSlot(Request $request)
    {
        try {
            $providerId = auth()->id();
            if (! $providerId) {
                return response()->error("No autenticado", 401);
            }

            // Normalizar payload anidado del frontend (para POST)
            // Esto asume que el frontend envía { employee_id: { employee: 'X' }, client_id: { clients: 'Y' } }
            // Si el frontend ya está enviando los IDs directos (sin el objeto anidado), estas líneas deben eliminarse o ajustarse.
            $request->merge([
                'employee_id' => $request->input('employee_id.employee'),
                'client_id'   => $request->input('client_id.clients'),
            ]);

            $validated = $request->validate([
                'slot.weekday'  => 'required|integer|min:1|max:7',
                'slot.hour'     => 'required|date_format:H:i',
                'employee_id'   => 'required|integer|exists:users,id',
                'client_id'     => 'required|integer|exists:users,id',
            ]);

            // Calcular próxima fecha para el weekday elegido
            $today    = Carbon::today();
            // Monday = 1 ... Sunday = 7 in ISO 8601
            // dayOfWeekIso returns 1 for Monday, 7 for Sunday.
            // We need to adjust to 0 for Monday if your 'weekday' column is 0-indexed for Monday-Sunday,
            // or 1-indexed for Monday-Sunday if 'weekday' 1-7.
            // Given your frontend 'weekday' is 1-7 (Lun=1, Dom=7) and JS getDay() is 0-6 (Dom=0),
            // and you map JS 0 to 7, this logic looks correct for 1-7.
            $current  = $today->dayOfWeekIso; // 1 = Mon ... 7 = Sun

            $target   = $validated['slot']['weekday']; // 1–7
            $diff     = ($target - $current + 7) % 7;  // days to add (0 = today)
            $date     = $today->copy()->addDays($diff)->toDateString();

            $hour     = $validated['slot']['hour']; // "09:00"
            $start    = "{$hour}:00";
            $end      = Carbon::createFromFormat('H:i', $hour)
                              ->addHour()
                              ->format('H:i:s'); // Changed to H:i:s for consistency

            $slot = CalendarSlots::updateOrCreate(
                [
                    'provider_id' => $providerId,
                    'date'        => $date,
                    'start_time'  => $start,
                ],
                [
                    'end_time'    => $end,
                    'employee_id' => $validated['employee_id'],
                    'client_id'   => $validated['client_id'],
                    'status'      => 'reservado', // Ensure status is set for new slots
                ]
            );

            // Recolectar datos para el mismo response que calendar_slots()
            $slots = CalendarSlots::with(['client:id,name,email','provider:id,name,email','employee:id,name,email'])
                ->where('provider_id', $providerId)
                ->orderBy('date')
                ->orderBy('start_time')
                ->get();

             $employees = User::select('id')
                                 ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                                 ->where(function($q) use ($providerId) {
                                     $q->where('id', $providerId)
                                     ->orWhere(function($q2) use ($providerId) {
                                         $q2->where('customer_group_id', $providerId)
                                             ->whereHas('roles', fn($q3) => $q3->where('name', 'employees'));
                                     });
                                 })
                                 ->get();

            $clients = \App\Models\User::select('id')
                ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                ->whereHas('roles', fn($q) => $q->where('name', 'clients'))
                ->get();

            $availabilities = \App\Models\CalendarAvailabilities::select('id', 'weekday', 'start_time', 'end_time', 'status')
                ->where('provider_id', $providerId)
                ->orderBy('weekday')
                ->orderBy('start_time')
                ->get();

            return response()->success(
                compact('slots', 'employees', 'clients', 'availabilities'),
                "Cita asignada/actualizada correctamente y datos recargados"
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Reasignar un empleado y/o cliente a una cita existente.
     * Este método se usa para ACTUALIZAR citas existentes.
     * Recibe el ID del slot a actualizar en la URL.
     */
    public function reAssignEmployeeToSlot(Request $request, $slotId)
    {
        try {
            $providerId = auth()->id();
            if (! $providerId) {
                return response()->error("No autenticado", 401);
            }

            // Buscar el slot existente
            $slot = CalendarSlots::where('id', $slotId)
                                 ->where('provider_id', $providerId)
                                 ->first();

            if (!$slot) {
                return response()->error("Cita no encontrada o no pertenece a este proveedor.", 404);
            }

            // Normalizar payload anidado del frontend (para PUT)
            // El dataset que proporcionaste es:
            // {"slot":{...},"employee_id":{"employee":"9"},"client_id":{"clients":"7"}}
            // Así que necesitamos acceder a 'employee_id.employee' y 'client_id.clients'
            $request->merge([
                'employee_id' => $request->input('employee_id.employee'),
                'client_id'   => $request->input('client_id.clients'),
            ]);

            $validated = $request->validate([
                'employee_id' => 'required|integer|exists:users,id',
                'client_id'   => 'required|integer|exists:users,id',
                // No necesitamos validar 'slot.weekday' o 'slot.hour' aquí,
                // ya que estamos actualizando un slot existente por su ID.
                // Sin embargo, si quisieras validar que los datos del slot enviados
                // por el frontend coincidan con el slot encontrado, podrías hacerlo.
            ]);

            // Actualizar los campos del slot
            $slot->employee_id = $validated['employee_id'];
            $slot->client_id   = $validated['client_id'];
            $slot->status      = 'reservado'; // Aseguramos que la cita esté como reservada al reasignar
            $slot->save();

            // Recolectar datos para el mismo response que calendar_slots()
            // Esto asegura que el frontend reciba todos los datos actualizados del calendario
            $slots = CalendarSlots::with(['client:id,name,email','provider:id,name,email','employee:id,name,email'])
                ->where('provider_id', $providerId)
                ->orderBy('date')
                ->orderBy('start_time')
                ->get();

             $employees = User::select('id')
                                 ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                                 ->where(function($q) use ($providerId) {
                                     $q->where('id', $providerId)
                                     ->orWhere(function($q2) use ($providerId) {
                                         $q2->where('customer_group_id', $providerId)
                                             ->whereHas('roles', fn($q3) => $q3->where('name', 'employees'));
                                     });
                                 })
                                 ->get();

            $clients = \App\Models\User::select('id')
                ->selectRaw("CONCAT(name, ' ', COALESCE(company_name, '')) AS name")
                ->whereHas('roles', fn($q) => $q->where('name', 'clients'))
                ->get();

            $availabilities = \App\Models\CalendarAvailabilities::select('id', 'weekday', 'start_time', 'end_time', 'status')
                ->where('provider_id', $providerId)
                ->orderBy('weekday')
                ->orderBy('start_time')
                ->get();

            return response()->success(
                compact('slots', 'employees', 'clients', 'availabilities'),
                "Cita actualizada correctamente y datos recargados"
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function assignEmployeeToSlotClient(Request $request)
    {
        try {
            $clientId = auth()->id(); // The authenticated user is the client
            if (! $clientId) {
                return response()->error("No autenticado", 401);
            }

            $validated = $request->validate([
                'user_id'    => 'required|integer|exists:users,id', // This is the client_id
                'service_id' => 'required|integer|exists:servicios,id',
                'date'       => 'required|date_format:Y-m-d',
                'hour'       => 'required|date_format:H:i',
            ]);

            // Ensure the authenticated user matches the user_id in the request for security
            if ($clientId !== $validated['user_id']) {
                return response()->error("No autorizado para agendar para otro usuario", 403);
            }

            // Find the service to get the provider_id
            $service = Servicios::find($validated['service_id']); // Make sure to import App\Models\Servicio
            if (!$service) {
                return response()->error("Servicio no encontrado", 404);
            }

            // Assuming your 'servicios' table has a 'user_id' column that links to the provider
            $providerId = $service->user_id;

            // Calculate start_time and end_time
            $start_time = Carbon::parse($validated['hour'])->format('H:i:s');
            $end_time = Carbon::parse($validated['hour'])->addHour()->format('H:i:s'); // Assuming 1 hour slots

            // Attributes to search for an existing slot
            $searchAttributes = [
                'date'        => $validated['date'],
                'start_time'  => $start_time,
                'provider_id' => $providerId,
            ];

            // Attributes to create if no matching slot is found
            $createAttributes = [
                'end_time'    => $end_time,
                'status'      => 'reservado', // Default status when created
                'client_id'   => $validated['user_id'],
                'employee_id' => null, // As per your requirement
                'service_id'  => $validated['service_id'],
            ];

            // Use firstOrCreate
            $slot = CalendarSlots::firstOrCreate(
                $searchAttributes,
                $createAttributes
            );

            // If the slot was found (not created) and its status is not 'reservado', update it
            if (!$slot->wasRecentlyCreated && $slot->status !== 'reservado') {
                // If the slot was found and is 'disponible', reserve it
                if ($slot->status === 'disponible') {
                    $slot->update([
                        'status'      => 'reservado',
                        'client_id'   => $validated['user_id'],
                        'service_id'  => $validated['service_id'],
                        'employee_id' => null, // Ensure it remains null
                    ]);
                } else {
                    // If the slot is already 'reservado' or 'cancelado', it's not available
                    return response()->error("La franja horaria ya está " . $slot->status, 409); // 409 Conflict
                }
            } elseif (!$slot->wasRecentlyCreated && $slot->status === 'reservado') {
                // If the slot was found and already 'reservado' by someone else (or the same client trying to book again)
                return response()->error("La franja horaria ya está reservada", 409);
            }

            return response()->success($slot, "Cita agendada correctamente");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}