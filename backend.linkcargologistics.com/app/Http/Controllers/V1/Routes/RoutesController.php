<?php

namespace App\Http\Controllers\V1\Routes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Route;

class RoutesController extends Controller
{
    /**
     * GET /routes
     * Listado paginado de rutas
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
            $routes  = Route::with('items')->latest('id')->paginate($perPage);

            return response()->success(compact('routes'), 'Listado de rutas.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /routes
     * Crear nueva ruta
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'nullable|exists:users,id',
                'name'    => 'nullable|string|max:255',
                'date'    => 'nullable|date',
            ]);

            $route = Route::create($validated);

            return response()->success(compact('route'), 'Ruta creada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /routes/{id}
     * Mostrar una ruta específica
     */
    public function show(string $id)
    {
        try {
            $route = Route::with('items')->findOrFail($id);
            return response()->success(compact('route'), 'Detalle de la ruta.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 404);
        }
    }

    /**
     * PUT /routes/{id}
     * Actualizar una ruta existente
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'nullable|exists:users,id',
                'name'    => 'nullable|string|max:255',
                'date'    => 'nullable|date',
            ]);

            $route = Route::findOrFail($id);
            $route->update($validated);

            return response()->success(compact('route'), 'Ruta actualizada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * DELETE /routes/{id}
     * Eliminar una ruta
     */
    public function destroy(string $id)
    {
        try {
            $route = Route::findOrFail($id);
            $route->delete();

            return response()->success(null, 'Ruta eliminada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
