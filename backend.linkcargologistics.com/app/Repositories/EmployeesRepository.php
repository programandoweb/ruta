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

use App\Models\User;
use Illuminate\Http\Request;

class EmployeesRepository
{
    public function getAll(Request $request)
    {
        $authUser   =   auth()->user();
        $perPage    =   $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
        $search     =   $request->input('search');

        $query = User::query()
            ->with('roles:name')
            ->whereHas('roles', function ($q) {
                $q->where('name', 'employees');
                $q->orWhere('name', 'managers');
            });

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $query->where("customer_group_id",$authUser->customer_group_id??$authUser->id);
        $query->select("id","name","company_name");
        $paginated  =   $query->paginate($perPage);

        // Quitar campo roles de cada elemento de la colección
        $paginated->getCollection()->transform(function ($item) {
            unset($item->roles);
            return $item;
        });

        return $paginated;
    }


    public function create(array $data, $request): User
    {
        //p( $data );
        $user = User::create([
            'name'                  => $data['name'],
            'email'                 => $data['email'],
            'password'              => $data['password'], // ya viene encriptado desde el controlador
            'phone_number'          => $data['phone_number'] ?? null,
            'company_name'          => $data['company_name'] ?? null,
            'identification_number' => $data['identification_number'] ?? null,
            'customer_group_id'     => $data['customer_group_id'] ?? null,
        ]);
        
        if($request->has("role")){
            $user->assignRole($request->role); 
        }else{
            $user->assignRole('employees');
        }

        return $user;
    }


    public function findById(string $id): ?User
    {
        return User::with('roles:name')
            ->whereHas('roles', function ($q) {
                $q->where('name', 'employees');
                $q->orWhere('name', 'managers');
            })
            ->find($id);
    }

    public function update(string $id, array $data): ?User
    {
        $user = User::whereHas('roles', function ($q) {
            $q->where('name', 'employees');
        })->find($id);

        if ($user) {
            $user->update($data);
        }

        return $user;
    }

    public function delete(string $id): bool
    {
        $user = User::whereHas('roles', function ($q) {
            $q->where('name', 'employees');
        })->find($id);

        if ($user) {
            return (bool) $user->delete();
        }

        return false;
    }
}
