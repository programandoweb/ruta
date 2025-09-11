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

use App\Models\Servicios;
use Illuminate\Http\Request;

class UserAccountRepository
{
    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
        $search  = $request->input('search');

        $query = Servicios::query()->with('user:id,name');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Servicios
    {
        return Servicios::create($data);
    }

    public function findById(string $id,$request=false): ?Servicios
    {
        $authUser   =   auth()->user();
        if($request){
            return Servicios::with('user:id,name')->where("user_id",$authUser->customer_group_id??$authUser->id)->first();
        }
        return Servicios::with('user:id,name')->where("user_id",$id)->first();
    }

    public function update(string $id, array $data, $request): ?Servicios
    {
        $authUser   =   auth()->user();
        $item = Servicios::where("user_id",$authUser->customer_group_id??$authUser->id)->first();
        //p($item);
        if ($item) {            
            $item->update($data);
        }else{
            $data["user_id"]    =       $request->user()->id;
            //p($data);
            $item = Servicios::create($data);
        }
        return $item;
    }

    public function delete(string $id): bool
    {
        $item = Servicios::find($id);
        if ($item) {
            return (bool) $item->delete();
        }
        return false;
    }
}
