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

namespace App\Repositories;

use App\Models\EventOrder;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;


class EventOrderRepository
{

    /**
     * Obtener una orden de evento con relaciones por ID.
     *
     * @param int $id
     * @return EventOrder|null
     */
    public function show(int $id): ?EventOrder
    {
        return EventOrder::with([
            'client', 'provider', 'employee', 'event', 'servicio', 'calendar_slot'
        ])->find($id);
    }



    /**
     * Obtener las órdenes de evento con paginación y filtros por rol.
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(Request $request)
    {
        $perPage  = $request->input('per_page', config('constants.RESULT_X_PAGE', 10));
        $authUser = $request->user();

        $query = EventOrder::with(['client', 'provider', 'employee', 'event', 'servicio', 'calendar_slot']);

        // Filtro por rol
        if ($authUser->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($authUser->hasRole('clients')) {
            $query->where('client_id', $authUser->customer_group_id ?? $authUser->id);
        } elseif ($authUser->hasRole(['providers', 'managers', 'employees'])) {
            $query->where('provider_id', $authUser->customer_group_id ?? $authUser->id);            
        } else {
            $query->whereRaw('1 = 0');
        }

        // Búsqueda
        if ($search = $request->input('search')) {
            $query->whereHas('servicio', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Paginar y transformar los resultados
        return $query->orderByDesc('id')->paginate($perPage)->through(function ($item) {
            return [
                'id'        => $item->id,
                'Cliente'   => $item->client?->name,
                'Empleado'  => $item->employee?->name,
                'Precio'    => $item->price,
                'Cantidad'  => $item->quantity,
                'Creada'    => Carbon::parse($item->created_at)->format('d/m/Y'),
                'Servicio'  => $item->servicio?->name,
                'Estatus'    => $item->status,
            ];
        });

    }


    /**
     * Crear o actualizar una orden de evento por slot y servicio.
     *
     * @param array $data
     * @return EventOrder
     */
    public function createOrUpdate(array $data): EventOrder
    {
        return EventOrder::updateOrCreate(
            [
                'calendar_slot_id' => $data['calendar_slot_id'],
                'servicio_id'      => $data['servicio_id'],
            ],
            $data
        );
    }


    /**
     * Crear una nueva orden de evento.
     *
     * @param array $data
     * @return EventOrder
     */
    public function create(array $data): EventOrder
    {
        return EventOrder::create($data);
    }

    /**
     * Obtener todas las órdenes de evento.
     *
     * @return Collection
     */
    public function all(): Collection
    {
        return EventOrder::all();
    }

    /**
     * Obtener una orden de evento por ID.
     *
     * @param int $id
     * @return EventOrder|null
     */
    public function find(int $id): ?EventOrder
    {
        return EventOrder::find($id);
    }

    /**
     * Obtener las órdenes filtradas por proveedor autenticado.
     *
     * @param Request $request
     * @return Collection
     */
    public function get(Request $request): Collection
    {
        $user           =   $request->user();
        $providerId     =   $user->customer_group_id ?? $user->id;

        return EventOrder::with(['client', 'provider', 'employee', 'event', 'servicio', 'calendar_slot'])
                            ->where('provider_id', $providerId)
                            ->get();
    }
}
