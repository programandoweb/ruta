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
use App\Models\Routes;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
    public function importExcelOld(Request $request)
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
                if ($index === 0 || empty($row[2])) continue; // saltar encabezados

                $items[] = [
                    'guide'               => $row[0] ?? null,
                    'name'                => $row[1] ?? null,
                    'phone'               => isset($row[2]) ? (string) $row[2] : '',
                    'origin_address'      => $row[3] ?? '',
                    'destination_address' => $row[4] ?? '',
                    'type'                => $row[5] ?? 'deliver',
                    'status'              => $row[6] ?? 'Borrador',
                ];

            }

            /*
                Si tiene $request->route_id, procedemos a guardar de una vez ese listado en route
            */
            if($request->has("route_id")){
                $route = Routes::find($request->route_id);

            }
                

            return response()->success(compact('items'), 'Archivo procesado correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function importExcel(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'file'     => 'required|file|mimes:xls,xlsx|max:5120',
                'route_id' => 'required|exists:routes,id',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            $rows = Excel::toArray([], $request->file('file'))[0] ?? [];

            

            $items = [];
            $boxAndGuide = [];

            foreach ($rows as $index => $row) {
                // Saltamos encabezado o filas sin teléfono (columna 2)
                if ($index === 0 || empty($row[2])) {
                    continue;
                }

                // Procesar columna GUIDE_BOX (GUIA_CAJA_TIPO) - Columna 0
                if (!empty($row[0])) {
                    $pairs = explode(',', $row[0]);

                    foreach ($pairs as $pair) {
                        $parts = explode('_', trim($pair));
                        [$guide, $box, $service] = array_pad($parts, 3, null);

                        if ($guide && $box) {
                            $boxAndGuide[] = [
                                'guide'   => $guide,
                                'box'     => $box,
                                'service' => $service,
                            ];
                        }
                    }
                }

                //p($row[9]);

                // Mapeo de items
                $items[] = [
                    'guide'               => $row[0] ?? null,
                    'name'                => $row[1] ?? null,
                    'phone'               => isset($row[2]) ? (string) $row[2] : '',
                    'origin_address'      => $row[3] ?? '',
                    'destination_address' => $row[4] ?? '',
                    'type'                => $row[5] ?? 'deliver',
                    'observation'         => $row[9] ?? 'Sin observación',
                    'status'              => 'Borrador',
                    // ✅ Nueva columna 'day' (Índice 6). Si está vacío o no es numérico, por defecto 1.
                    'day'                 => (!empty($row[10]) && is_numeric($row[10])) ? (int)$row[10] : 1,
                ];
            }

            if (empty($items)) {
                return response()->error('El archivo no contiene registros válidos.', 422);
            }

            // Usamos el modelo Routes según tu código original
            $route = Routes::findOrFail($request->route_id);

            // Limpiar items anteriores e insertar los nuevos
            $route->items()->delete();
            $route->items()->createMany($items);

            // Actualizar la ruta con la info de cajas procesada
            $route->update([
                'box_and_guide' => $boxAndGuide,
            ]);

            DB::commit();

            return response()->success(
                [
                    'route_id'       => $route->id,
                    'items_imported' => count($items),
                    'boxes_detected' => count($boxAndGuide),
                    'box_and_guide'  => $boxAndGuide,
                ],
                'Excel importado correctamente con asignación de días.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }


    public function importExcelSinDia(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'file'     => 'required|file|mimes:xls,xlsx|max:5120',
                'route_id' => 'required|exists:routes,id',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            $rows = Excel::toArray([], $request->file('file'))[0] ?? [];

            $items = [];
            $boxAndGuide = [];

            foreach ($rows as $index => $row) {
                if ($index === 0 || empty($row[2])) {
                    continue;
                }

                // Procesar columna GUIDE_BOX (GUIA_CAJA_TIPO)
                if (!empty($row[0])) {
                    $pairs = explode(',', $row[0]);

                    foreach ($pairs as $pair) {
                        [$guide, $box, $service] = array_pad(
                            explode('_', trim($pair)),
                            3,
                            null
                        );

                        if ($guide && $box) {
                            $boxAndGuide[] = [
                                'guide'   => $guide,
                                'box'     => $box,
                                'service' => $service, // ej: MOV
                            ];
                        }
                    }
                }

                $items[] = [
                    'guide'               => $row[0] ?? null,
                    'name'                => $row[1] ?? null,
                    'phone'               => isset($row[2]) ? (string) $row[2] : '',
                    'origin_address'      => $row[3] ?? '',
                    'destination_address' => $row[4] ?? '',
                    'type'                => $row[5] ?? 'deliver',
                    'status'              => 'Borrador',
                ];
            }

            if (empty($items)) {
                return response()->error('El archivo no contiene registros válidos.', 422);
            }

            $route = Routes::findOrFail($request->route_id);

            $route->items()->delete();
            $route->items()->createMany($items);

            $route->update([
                'box_and_guide' => $boxAndGuide,
            ]);

            DB::commit();

            return response()->success(
                [
                    'route_id'       => $route->id,
                    'items_imported' => count($items),
                    'boxes_detected' => count($boxAndGuide),
                    'box_and_guide'  => $boxAndGuide,
                ],
                'Excel importado correctamente.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }



    public function importExcelAntes(Request $request)
    {
        
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'file'     => 'required|file|mimes:xls,xlsx|max:5120',
                'route_id' => 'required|exists:routes,id',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            $rows = Excel::toArray([], $request->file('file'))[0] ?? [];

            $items = [];
            $boxAndGuide = [];

            foreach ($rows as $index => $row) {
                if ($index === 0 || empty($row[2])) {
                    continue;
                }

                // 👉 Procesar columna GUIDE_BOX
                if (!empty($row[0])) {
                    $pairs = explode(',', $row[0]);

                    foreach ($pairs as $pair) {
                        [$guide, $box] = array_pad(explode('_', trim($pair)), 2, null);

                        if ($guide && $box) {
                            $boxAndGuide[] = [
                                'guide' => $guide,
                                'box'   => $box,
                            ];
                        }
                    }
                }

                $items[] = [
                    'guide'               => $row[0] ?? null,
                    'name'                => $row[1] ?? null,
                    'phone'               => isset($row[2]) ? (string) $row[2] : '',
                    'origin_address'      => $row[3] ?? '',
                    'destination_address' => $row[4] ?? '',
                    'type'                => $row[5] ?? 'deliver',
                    'status'              => $row[6]==='pending'?"Borrador":'Borrador',
                ];
            }

            //p($items);

            if (empty($items)) {
                return response()->error('El archivo no contiene registros válidos.', 422);
            }

            $route = Routes::findOrFail($request->route_id);

            
            // Limpiar items anteriores
            $route->items()->delete();

            // Guardar items
            $route->items()->createMany($items);

            // Guardar JSON box_and_guide en la ruta
            $route->update([
                'box_and_guide' => $boxAndGuide,
            ]);

            DB::commit();

            return response()->success(
                [
                    'route_id'        => $route->id,
                    'items_imported'  => count($items),
                    'boxes_detected'  => count($boxAndGuide),
                    'box_and_guide'   => $boxAndGuide,
                ],
                'Excel importado correctamente.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }



    public function importExcelOLD2026(Request $request)
    {
        DB::beginTransaction();
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xls,xlsx|max:5120',
                'route_id' => 'required|exists:routes,id',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            // ✅ Leer archivo Excel directamente (sin usar realPath)
            $rows = Excel::toArray([], $request->file('file'))[0] ?? [];
            $items = [];

            foreach ($rows as $index => $row) {
                if ($index === 0 || empty($row[2])) continue; // saltar encabezados vacíos

                $items[] = [
                    'guide'               => $row[0] ?? null,
                    'name'                => $row[1] ?? null,
                    'phone'               => isset($row[2]) ? (string) $row[2] : '',
                    'origin_address'      => $row[3] ?? '',
                    'destination_address' => $row[4] ?? '',
                    'type'                => $row[5] ?? 'deliver',
                    'status'              => $row[6] ?? 'Borrador',
                ];
            }

            if (empty($items)) {
                return response()->error('El archivo no contiene registros válidos.', 422);
            }

            // ✅ Guardar los items en la ruta asociada
            $route = Routes::findOrFail($request->route_id);

            // Eliminar items previos antes de registrar los nuevos
            $route->items()->delete();

            // Crear los nuevos items importados
            $route->items()->createMany($items);

            DB::commit();

            return response()->success(
                [
                    'route' => $route,
                    'items_imported' => count($items),
                    'message' => 'Items importados y guardados correctamente en la ruta.'
                ],
                'Items importados y guardados correctamente en la ruta.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * PUT /routes/{route_id}/setGuideRemote
     */
    public function setGuideRemote(Request $request, $route_id)
    {
        try {

            $validated = $request->validate([
                '*.value' => 'required|string|max:255',
                '*.lat'   => 'required|numeric',
                '*.lng'   => 'required|numeric',
            ]);

            // 👇 aquí iremos paso a paso después
            // $validated contiene el payload validado
            // $route_id disponible

            foreach ($request->all() as $key => $value) {
                $item   =   RouteItem::where('route_id', $route_id)
                                    ->where('lat', $value["lat"])
                                    ->where('lng', $value["lng"])
                                    ->first();
                $item->guide_remote =  $value["value"];
                $item->save();                
            }

           

            return response()->success(
                [
                    'route_id' => $route_id,
                    'data'     => $validated,
                ],
                'Payload recibido y validado correctamente.'
            );

        } catch (\Throwable $e) {
            return response()->error(
                $e->getMessage(),
                $e->getCode() ?: 422
            );
        }
    }



}
