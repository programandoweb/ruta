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

use App\Models\UserCharacteristics;
use Illuminate\Http\Request;

class UserCharacteristicsRepository
{
    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
        $search  = $request->input('search');

        $query = UserCharacteristic::query()->with('user:id,name');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('key', 'like', "%$search%")
                  ->orWhere('value', 'like', "%$search%");
            });
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): UserCharacteristic
    {
        return UserCharacteristic::create($data);
    }

    public function findById(string $id): ?UserCharacteristic
    {
        return UserCharacteristic::with('user:id,name')->find($id);
    }

    public function update(string $id, array $data): ?UserCharacteristic
    {
        $item = UserCharacteristic::find($id);
        if ($item) {
            $item->update($data);
        }
        return $item;
    }

    public function delete(string $id): bool
    {
        $item = UserCharacteristic::find($id);
        if ($item) {
            return (bool) $item->delete();
        }
        return false;
    }
}
