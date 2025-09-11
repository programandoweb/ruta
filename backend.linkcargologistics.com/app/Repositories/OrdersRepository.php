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

namespace App\Repositories;

use App\Models\Orders;
use Illuminate\Http\Request;

class OrdersRepository
{
    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
        $search  = $request->input('search');

        $query = Orders::with('business:id,name', 'user:id,name');

        if (!empty($search)) {
            $query->whereHas('business', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): Orders
    {
        return Orders::create($data);
    }

    public function findById(string $id): ?Orders
    {
        return Orders::with('items', 'user:id,name')->find($id);
    }

    public function update(string $id, array $data, Request $request = null): ?Orders
    {
        $order = Orders::find($id);

        if ($order) {
            $order->update($data);
        } else {
            if ($request && !$data['user_id']) {
                $data['user_id'] = $request->user()->id;
            }
            $order = Orders::create($data);
        }

        return $order;
    }

    public function delete(string $id): bool
    {
        $order = Orders::find($id);
        return $order ? (bool) $order->delete() : false;
    }
}
