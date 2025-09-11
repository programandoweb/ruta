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

use Illuminate\Http\Request;
use App\Models\InventoryCategories;

class InventoryCategoriesRepository
{

    public function get()
    {        
        $query   = InventoryCategories::query();
        return $query->orderBy('name')->get();
    }

    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 10));
        $query   = InventoryCategories::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')->paginate($perPage)->through(function ($category) {
            return [
                'id'   => $category->id,
                'name' => $category->name,
            ];
        });
    }

    public function findById($id): ?InventoryCategories
    {
        return InventoryCategories::find($id);
    }

    public function create(array $data): InventoryCategories
    {
        return InventoryCategories::create($data);
    }

    public function update($id, array $data): ?InventoryCategories
    {
        $category = InventoryCategories::find($id);
        if (!$category) {
            return null;
        }

        $category->update($data);
        return $category;
    }

    public function delete($id): bool
    {
        $category = InventoryCategories::find($id);
        if (!$category) {
            return false;
        }

        return (bool) $category->delete();
    }
}
