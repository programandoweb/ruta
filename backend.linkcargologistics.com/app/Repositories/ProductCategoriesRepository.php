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

use App\Models\ProductCategory;

class ProductCategoriesRepository
{
    public function getAll($request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $search  = $request->input('search');

        $query = ProductCategory::query()->select('id', 'name');

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage)->through(function ($item) {
            return [
                'id'   => $item->id,
                'name' => $item->name,
            ];
        });
    }

    public function findById($id)
    {
        return ProductCategory::find($id);
    }

    public function create(array $data)
    {
        return ProductCategory::create($data);
    }

    public function update($id, array $data)
    {
        $category = ProductCategory::find($id);
        if (!$category) {
            return null;
        }

        $category->update($data);
        return $category;
    }

    public function get()
    {
        return ProductCategory::select('id', 'name')->get();
    }

    public function delete($id)
    {
        $category = ProductCategory::find($id);
        if (!$category) {
            return false;
        }

        return $category->delete();
    }
}
