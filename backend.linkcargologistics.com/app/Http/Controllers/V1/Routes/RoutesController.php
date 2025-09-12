<?php

namespace App\Http\Controllers\V1\Routes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Routes;
use Illuminate\Support\Facades\DB;

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
            $routes  = Routes::with('items')->latest('id')->paginate($perPage);

            return response()->success(compact('routes'), 'Listado de rutas.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /routes
     * Crear nueva ruta con items hijos
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'user_id'             => 'nullable|exists:users,id',
                'name'                => 'nullable|string|max:255',
                'phone'               => 'required|string|max:20',
                'origin_address'      => 'required|string|max:255',
                'destination_address' => 'required|string|max:255',
                'type'                => 'required|in:deliver,pickup',
                'date'                => 'nullable|date',
                'items'               => 'nullable|array',
                'items.*.name'               => 'nullable|string|max:255',
                'items.*.phone'              => 'required_with:items|string|max:20',
                'items.*.origin_address'     => 'required_with:items|string|max:255',
                'items.*.destination_address'=> 'required_with:items|string|max:255',
                'items.*.type'               => 'required_with:items|in:deliver,pickup',
                'items.*.status'             => 'nullable|string|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            $route = Routes::create($validated);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $route->items()->create($item);
                }
            }

            DB::commit();
            return response()->success(compact('route'), 'Ruta creada correctamente con items.');
        } catch (\Throwable $e) {
            DB::rollBack();
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
            $route = Routes::with('items')->find($id);
            return response()->success(compact('route'), 'Detalle de la ruta.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 404);
        }
    }

    /**
     * PUT /routes/{id}
     * Actualizar una ruta existente con sus items
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'user_id'             => 'nullable|exists:users,id',
                'name'                => 'nullable|string|max:255',
                'phone'               => 'required|string|max:20',
                'origin_address'      => 'required|string|max:255',
                'destination_address' => 'required|string|max:255',
                'type'                => 'required|in:deliver,pickup',
                'date'                => 'nullable|date',
                'items'               => 'nullable|array',
                'items.*.name'               => 'nullable|string|max:255',
                'items.*.phone'              => 'required_with:items|string|max:20',
                'items.*.origin_address'     => 'required_with:items|string|max:255',
                'items.*.destination_address'=> 'required_with:items|string|max:255',
                'items.*.type'               => 'required_with:items|in:deliver,pickup',
                'items.*.status'             => 'nullable|string|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            $route = Routes::findOrFail($id);
            $route->update($validated);

            if (isset($validated['items'])) {
                $route->items()->delete();
                foreach ($validated['items'] as $item) {
                    $route->items()->create($item);
                }
            }

            DB::commit();
            return response()->success(compact('route'), 'Ruta actualizada correctamente con items.');
        } catch (\Throwable $e) {
            DB::rollBack();
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
            $route = Routes::findOrFail($id);
            $route->delete();

            return response()->success(null, 'Ruta eliminada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
