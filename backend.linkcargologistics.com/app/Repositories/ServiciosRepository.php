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
use App\Models\Services;
use App\Models\Business;

class ServiciosRepository
{
    public function getService(string $getService)
    {
        return Servicios::where('type', 'services')->find($getService);
    }

    public function getBySlug(string $slug)
    {
        return Services::select("id", "name", "pathname", "description", "image", "cover")
            ->with("related")
            ->where("pathname", $slug)
            ->first();
    }

    public function get()
    {
        return Services::select("id", "name", "pathname", "description", "image", "cover")->get();
    }

    public function getMeServices($user_id)
    {
        return Servicios::where("user_id",$user_id)->get();
    }

    /**
     * Obtener todos los servicios, con filtros si vienen en el request.
     */
    public function getAll($request)
    {
        $perPage    = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $user       = $request->user();
        $search     = $request->input('search');
        $segment    = request()->segment(count(request()->segments()));
        
        
        $authUser   = auth()->user();
        if ($authUser->hasRole('employees')||$authUser->hasRole('managers')) {
            if (!$authUser->customer_group_id) {
                return response()->error("El empleado no tiene un proveedor asignado (customer_group_id).", 400);
            }
            $providerId = $authUser->customer_group_id;
        } else {
            $providerId = $authUser->id;
        }

        $query = Servicios::query()
            ->with(['user:id,name,email', 'category:id,name', 'productCategory:id,name'])
            ->select('id', 'user_id', 'category_id', 'name', 'description')
            ->where('type', $segment??$request->input('type')??'services');

        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } elseif ($user->hasRole('providers')||$user->hasRole('employees')||$user->hasRole('managers')) {
            $query->where('user_id', $providerId);
        } else {
            $query->whereRaw('1 = 0');
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->through(function ($item) {
            $item->usuario    = $item->user?->name;
            //$item->categoria  = $item->category?->name??$item->productCategory?->name;
            unset($item->user, $item->category, $item->user_id, $item->category_id,$item->productCategory);
            return $item;
        });
    }

    /**
     * Crear un nuevo servicio.
     */
    public function create(array $data)
    {
        $data['type'] = $data['type'] ?? 'services';
        return Servicios::create($data);
    }

    /**
     * Buscar un servicio por ID.
     */
    public function findById($id)
    {
        return Servicios::with('user', 'category')->find($id);
    }

    public function getServicios()
    {
        return Servicios::where("type","services")->get();
        //return Business::get();
    }

    /**
     * Actualizar un servicio existente.
     */
    public function update($id, array $data)
    {
        $servicio = Servicios::find($id);
        if (!$servicio) {
            return null;
        }
        $servicio->update($data);
        return $servicio;
    }

    /**
     * Eliminar un servicio.
     */
    public function delete($id)
    {
        $servicio = Servicios::where('type', 'services')->find($id);
        if (!$servicio) {
            return false;
        }

        return $servicio->delete();
    }
}
