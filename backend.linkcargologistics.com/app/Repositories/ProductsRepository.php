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

use App\Models\Products;
use App\Models\Business;

class ProductsRepository
{
    public function getMenu()
    {
        $query = Products::query();
        $query->with(["productCategory","servicio"]);
        return $query->get();
    }

    public function get($user_id = false)
    {
        $query = Products::query()
            ->select('id', 'name', 'name as label', 'description', 'image', 'rating', 'price');

        if ($user_id) {
            $query->where('user_id', $user_id);
        }

        return $query->get();
    }

    public function getAll($request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $search  = $request->input('search');

        $authUser = auth()->user();
        $providerId = $authUser->hasRole('employees') || $authUser->hasRole('managers')
            ? ($authUser->customer_group_id ?: 0)
            : $authUser->id;

        $query = Products::select('id', 'product_category_id', 'name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });

        return $query->orderByDesc('id')->paginate($perPage)->through(function ($item) {
            unset($item->user, $item->productCategory, $item->user_id, $item->product_category_id);
            return $item;
        });
    }

    public function create(array $data)
    {
        return Products::updateOrCreate(
            ['name' => $data['name']],
            $data
        );
    }

    public function findById($id)
    {
        return Products::with(['productCategory:id,name',"servicio","items",'provider'])->find($id);
    }

    public function update($id, array $data)
    {
        $product = Products::find($id);
        if (!$product) return null;

        $product->update($data);
        return $product;
    }

    public function delete($id)
    {
        $product = Products::find($id);
        if (!$product) return false;

        return $product->delete();
    }

    public function getServicios()
    {
        return Business::get();
    }

    public function getBySlug(string $slug)
    {
        return Products::select('id', 'name', 'description', 'image', 'gallery')
            ->where('pathname', $slug)
            ->first();
    }

    public function getService(string $id)
    {
        return Products::with(['user:id,name,email', 'category:id,name'])
            ->find($id);
    }
}
