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

namespace App\Http\Controllers\V1\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\ProductCategoriesRepository;

class CategoriesController extends Controller
{
    protected $categoriesRepository;

    public function __construct(ProductCategoriesRepository $categoriesRepository)
    {
        $this->categoriesRepository = $categoriesRepository;
    }

    public function index(Request $request)
    {
        try {
            $categories = $this->categoriesRepository->getAll($request);
            return response()->success(compact('categories'), "Listado de categorías");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $category = $this->categoriesRepository->create($validated);

            return response()->success(compact('category'), "Categoría creada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $category = $this->categoriesRepository->findById($id);
            if (!$category && $id !== 'new') {
                return response()->error("Categoría no encontrada", 404);
            }

            $categories = $this->categoriesRepository->get();

            return response()->success(compact('category', 'categories'), "Categoría encontrada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
            ]);

            $category = $this->categoriesRepository->update($id, $validated);
            if (!$category) {
                return response()->error("Categoría no encontrada", 404);
            }

            return response()->success(compact('category'), "Categoría actualizada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->categoriesRepository->delete($id);
            if (!$deleted) {
                return response()->error("Categoría no encontrada", 404);
            }

            return response()->success([], "Categoría eliminada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
