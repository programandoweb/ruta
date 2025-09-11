<?php

namespace App\Repositories;

use App\Models\InventoryItem;
use App\Contracts\RawMaterialsRepositoryInterface;

class RawMaterialsRepository implements RawMaterialsRepositoryInterface
{
    public function getAll($request)
    {
        $perPage    = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $user       = $request->user();
        $search     = $request->input('search');

        $authUser   = auth()->user();
        if ($authUser->hasRole('employees') || $authUser->hasRole('managers')) {
            if (!$authUser->customer_group_id) {
                abort(response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400));
            }
            $ownerId = $authUser->customer_group_id;
        } else {
            $ownerId = $authUser->id;
        }

        $query = InventoryItem::query()
            ->with('unit:id,code,name')
            ->select('id', 'sku', 'name', 'base_unit_id', 'stock', 'avg_cost');

        if ($user->hasRole(['super-admin', 'admin'])) {
            // acceso total
        } elseif ($user->hasRole(['providers', 'employees', 'managers'])) {
            $query->where('user_id', $ownerId); // si aplicas multitenancy por user_id
        } else {
            $query->whereRaw('1 = 0');
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->through(function ($item) {
            $item->unidad = $item->unit?->name;
            unset($item->unit, $item->base_unit_id);
            return $item;
        });
    }


    public function findById($id)
    {
        return InventoryItem::with(['unit'])->find($id);
    }

    public function create(array $data)
    {
        return InventoryItem::create($data);
    }

    public function update(string $id, array $data)
    {
        $material = InventoryItem::find($id);
        if (!$material) return null;

        $material->update($data);
        return $material;
    }

    public function delete(string $id)
    {
        $material = InventoryItem::find($id);
        if (!$material) return false;

        return $material->delete();
    }
}
