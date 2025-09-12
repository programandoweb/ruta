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

namespace App\Http\Controllers\V1\Routes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RouteItem;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class RouteItemsController extends Controller
{
    /**
     * GET /routes/{route_id}/items
     */
    public function index($route_id)
    {
        try {
            $items = RouteItem::where('route_id', $route_id)->get();
            return response()->success(compact('items'), 'Listado de items de la ruta.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /routes/{route_id}/items
     */
    public function store(Request $request, $route_id)
    {
        try {
            $validated = $request->validate([
                'name'                => 'nullable|string|max:255',
                'phone'               => 'required|string|max:20',
                'origin_address'      => 'required|string|max:255',
                'destination_address' => 'required|string|max:255',
                'type'                => 'required|in:deliver,pickup',
                'status'              => 'nullable|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            $validated['route_id'] = $route_id;
            $item = RouteItem::create($validated);

            return response()->success(compact('item'), 'Item agregado a la ruta.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /routes/{route_id}/items/{id}
     */
    public function show($route_id, $id)
    {
        try {
            $item = RouteItem::where('route_id', $route_id)->findOrFail($id);
            return response()->success(compact('item'), 'Detalle del item.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 404);
        }
    }

    /**
     * PUT /routes/{route_id}/items/{id}
     */
    public function update(Request $request, $route_id, $id)
    {
        try {
            $validated = $request->validate([
                'name'                => 'nullable|string|max:255',
                'phone'               => 'required|string|max:20',
                'origin_address'      => 'required|string|max:255',
                'destination_address' => 'required|string|max:255',
                'type'                => 'required|in:deliver,pickup',
                'status'              => 'nullable|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            $item = RouteItem::where('route_id', $route_id)->findOrFail($id);
            $item->update($validated);

            return response()->success(compact('item'), 'Item actualizado.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * DELETE /routes/{route_id}/items/{id}
     */
    public function destroy($route_id, $id)
    {
        try {
            $item = RouteItem::where('route_id', $route_id)->findOrFail($id);
            $item->delete();
            return response()->success(null, 'Item eliminado.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /routes/import-excel
     * Procesa un archivo Excel de items
     */
    public function importExcel(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xls,xlsx|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            // ✅ Usar UploadedFile directamente, no realPath()
            $rows = Excel::toArray([], $request->file('file'))[0] ?? [];
            $items = [];

            foreach ($rows as $index => $row) {
                if ($index === 0) continue; // saltar encabezados

                $items[] = [
                    'name'                => $row[0] ?? null,
                    'phone'               => $row[1] ?? '',
                    'origin_address'      => $row[2] ?? '',
                    'destination_address' => $row[3] ?? '',
                    'type'                => $row[4] ?? 'deliver',
                    'status'              => $row[5] ?? 'Borrador',
                ];
            }

            return response()->success(compact('items'), 'Archivo procesado correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
