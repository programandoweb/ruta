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

use Illuminate\Http\Request;
use App\Models\Business;

class BusinessRepository
{
    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $search  = $request->input('search');

        $query = Business::query();

        // Columnas visibles
        $query->selectRaw('
            id,
            name AS Nombre,
            contact_email AS Correo,
            contact_phone AS Teléfono,
            location AS Ubicación
        ');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('contact_email', 'like', '%' . $search . '%')
                  ->orWhere('contact_phone', 'like', '%' . $search . '%')
                  ->orWhere('location', 'like', '%' . $search . '%');
            });
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Business
    {
        return Business::create($data);
    }

    public function update(string $id, array $data): ?Business
    {
        $business = Business::find($id);
        if (!$business) {
            return null;
        }

        $business->update($data);
        return $business;
    }

    public function delete(string $id): bool
    {
        $business = Business::find($id);
        return $business ? $business->delete() : false;
    }

    public function findById(string $id): ?Business
    {
        return Business::find($id);
    }
}
