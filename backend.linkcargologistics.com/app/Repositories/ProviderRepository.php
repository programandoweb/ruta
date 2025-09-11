<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProviderRepository
{
    public function getAll($request)
    {
        $perPage    =   $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $search     =   $request->input('search');

        $query      =   User::role('providers');

        $query->selectRaw("id, name as Nombre, email")
              ->with(['roles' => fn ($q) => $q->select('name')]);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('identification_number', 'like', '%' . $search . '%')
                  ->orWhere('phone_number', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        return $query->paginate($perPage)->through(function ($provider) {
            $provider->Rol = $provider->roles->pluck('name')->implode(', ');
            unset($provider->roles);
            return $provider;
        });
    }

    public function create(array $data): ?User
    {
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $provider = User::create($data);
        $provider->assignRole('providers');
        return $provider;
    }


    public function update(string $id, array $data): ?User
    {
        $provider = User::find($id);
        if ($provider) {
            if (!empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }
            $provider->update($data);
        }
        return $provider;
    }


    public function delete(string $id): bool
    {
        $provider = User::find($id);
        if ($provider) {
            return $provider->delete();
        }
        return false;
    }

    public function findById(string $id): ?User
    {
        return User::role('providers')->find($id);
    }
}
