<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Events;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\EventOrderRepository;

class EventOrdersController extends Controller
{
    protected $eventOrderRepository;

    public function __construct(EventOrderRepository $eventOrderRepository)
    {
        $this->eventOrderRepository = $eventOrderRepository;
    }

    /**
     * Actualizar el estado de una orden.
     */
    public function status(Request $request, int $id)
    {
        try {
            $order = $this->eventOrderRepository->find($id);

            if (! $order) {
                return response()->error('Orden no encontrada', 404);
            }

            $auth = $request->user();
            $providerId = $auth->customer_group_id ?? $auth->id;

            if (
                ($auth->hasRole('clients') && $order->client_id !== $providerId) ||
                ($auth->hasRole(['providers', 'managers', 'employees']) && $order->provider_id !== $providerId)
            ) {
                return response()->error('No autorizado para modificar esta orden', 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:en_progreso,completada,cancelada',
            ]);

            $order->status = $validated['status'];
            $order->save();



            $order = $this->eventOrderRepository->show($order->id);

            if (! $order) {
                return response()->error('Orden no encontrada', 404);
            }

            // Verificación de acceso (por modelo, no array)
            $auth = $request->user();
            $providerId = $auth->customer_group_id ?? $auth->id;

            if (
                ($auth->hasRole('clients') && $order->client_id !== $providerId) ||
                ($auth->hasRole(['providers', 'managers', 'employees']) && $order->provider_id !== $providerId)
            ) {
                return response()->error('No autorizado para ver esta orden', 403);
            }

            // Estructura de respuesta transformada para el frontend
            $formatted = [
                'id'        => $order->id,
                'Cliente'   => $order->client?->name,
                'Proveedor' => $order->provider?->name,
                'Empleado'  => $order->employee?->name,
                'Servicio'  => $order->servicio?->name,
                'Cantidad'  => $order->quantity,
                'Precio'    => $order->price,
                'Fecha'     => \Carbon\Carbon::parse($order->created_at)->format('d/m/Y'),
                'status'    => $order->status,
                'Horario'   => [
                    'Día'    => \Carbon\Carbon::parse($order->calendar_slot?->date)->format('d/m/Y'),
                    'Inicio' => $order->calendar_slot?->start_time,
                    'Fin'    => $order->calendar_slot?->end_time,
                    'Estado' => $order->calendar_slot?->status,
                ],
            ];

            return response()->success(['order' => $formatted], 'Detalle de la orden');



            return response()->success(compact('order'), 'Estado actualizado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function index(Request $request)
    {
        try {
            $orders = $this->eventOrderRepository->getAll($request);
            return response()->success(compact('orders'), 'Listado de eventos Orders');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Mostrar el detalle de una orden específica.
     */
    public function show(Request $request, int $id)
    {
        try {
            $order = $this->eventOrderRepository->show($id);

            if (! $order) {
                return response()->error('Orden no encontrada', 404);
            }

            // Verificación de acceso (por modelo, no array)
            $auth = $request->user();
            $providerId = $auth->customer_group_id ?? $auth->id;

            if (
                ($auth->hasRole('clients') && $order->client_id !== $providerId) ||
                ($auth->hasRole(['providers', 'managers', 'employees']) && $order->provider_id !== $providerId)
            ) {
                return response()->error('No autorizado para ver esta orden', 403);
            }

            // Estructura de respuesta transformada para el frontend
            $formatted = [
                'id'        => $order->id,
                'Cliente'   => $order->client?->name,
                'Proveedor' => $order->provider?->name,
                'Empleado'  => $order->employee?->name,
                'Servicio'  => $order->servicio?->name,
                'Cantidad'  => $order->quantity,
                'Precio'    => $order->price,
                'Fecha'     => \Carbon\Carbon::parse($order->created_at)->format('d/m/Y'),
                'status'    => $order->status,
                'Horario'   => [
                    'Día'    => \Carbon\Carbon::parse($order->calendar_slot?->date)->format('d/m/Y'),
                    'Inicio' => $order->calendar_slot?->start_time,
                    'Fin'    => $order->calendar_slot?->end_time,
                    'Estado' => $order->calendar_slot?->status,
                ],
            ];

            return response()->success(['order' => $formatted], 'Detalle de la orden');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Registrar un producto asociado a un evento (orden).
     */
    public function add_product(Request $request)
    {
        try {
            $data = collect($request->all())->map(fn($val) => $val === '' ? null : $val)->toArray();

            //p($data);

            $validated = validator($data, [
                'product_id' => 'required|exists:servicios,id',
                'quantity'   => 'required|numeric|min:1',
                'price'      => 'required|numeric|min:0',
                'event_id'   => 'nullable|exists:events,id',
                'servicio_id'=> 'nullable|exists:servicios,id',
            ])->validate();

            $order = $this->eventOrderRepository->createOrUpdate([
                'provider_id'   => $request->user()->customer_group_id?? $request->user()->id ?? null,
                'event_id'      => $validated['event_id'] ?? null,
                'servicio_id'       => $data['product_id'] ?? null,
                'calendar_slot_id'  => $data['id'] ?? null,
                'client_id'     => $data["client_id"] ?? null,
                'employee_id'   => $request->user()->id ?? null,
                'price'         => $validated['price'],
                'quantity'      => $validated['quantity'],
                // Puedes agregar provider_id o employee_id si los determinas aquí
            ]);

            $orders =   $this->eventOrderRepository->get($request);

            return response()->success(compact('order','orders'), 'Producto agregado a la orden correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Eliminar un producto (orden) asociado al slot.
     */
    public function delete_product(Request $request, int $id)
    {
        try {
            $order = $this->eventOrderRepository->find($id);

            if (! $order) {
                return response()->error('Orden no encontrada', 404);
            }

            // Verificación de permisos (opcional, ajusta según tu lógica)
            $auth = $request->user();
            $providerId = $auth->customer_group_id ?? $auth->id;

            if ($order->provider_id !== $providerId) {
                return response()->error('No autorizado para eliminar esta orden', 403);
            }

            $order->delete();

            $orders = $this->eventOrderRepository->get($request);

            return response()->success(compact('orders'), 'Orden eliminada correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

}
