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

namespace App\Http\Controllers\V1\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\RawMaterialsRepository;
use App\Models\InventoryItem;
use App\Models\Units;
use App\Repositories\InventoryCategoriesRepository;

class RawMaterialsController extends Controller
{
    protected $rawMaterialsRepository;
    protected $categoriesRepository;

    public function __construct(
        RawMaterialsRepository $rawMaterialsRepository,
        InventoryCategoriesRepository $categoriesRepository
    ) {
        $this->rawMaterialsRepository = $rawMaterialsRepository;
        $this->categoriesRepository = $categoriesRepository;
    }

    public function index(Request $request)
    {
        try {
            $materials = $this->rawMaterialsRepository->getAll($request);
            return response()->success(compact('materials'), 'Listado de materias primas');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'                    => 'required|string|max:255',
                'base_unit_id'            => 'required|exists:units,id',
                'stock'                   => 'nullable|numeric|min:0',
                'avg_cost'                => 'nullable|numeric|min:0',
                'inventory_categories_id' => 'nullable',
            ]);

            // Generar prefijo SKU desde las primeras 3 letras del nombre
            $prefix = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $validated['name']), 0, 3));

            // Función para generar sufijo aleatorio alfanumérico
            $generateSuffix = function () {
                return substr(strtoupper(bin2hex(random_bytes(4))), 0, 5);
            };

            // Generar SKU completo y validar unicidad
            do {
                $sku = $prefix.'-'. $generateSuffix();
            } while (InventoryItem::where('sku', $sku)->exists());

            $validated['sku'] = $sku;

            $material = $this->rawMaterialsRepository->create($validated);

            return response()->success(compact('material'), 'Materia prima creada exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $material = $this->rawMaterialsRepository->findById($id);
            if (!$material && $id !== "new") {
                return response()->error('Materia prima no encontrada', 404);
            }

            $units      = Units::orderBy("name")->get();
            $raws       = InventoryItem::orderBy("name")->get();
            $categories = $this->categoriesRepository->get();

            return response()->success(compact('material', 'units', 'raws', 'categories'), 'Materia prima encontrada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'sku'                     => "sometimes|required|string|unique:inventory_items,sku,{$id}",
                'name'                    => 'sometimes|required|string|max:255',
                'base_unit_id'            => 'sometimes|required|exists:units,id',
                'stock'                   => 'nullable|numeric|min:0',
                'inventory_categories_id' => 'nullable',
                'avg_cost'                => 'nullable|numeric|min:0',
            ]);

            $material = $this->rawMaterialsRepository->update($id, $validated);
            if (!$material) {
                return response()->error('Materia prima no encontrada', 404);
            }

            return response()->success(compact('material'), 'Materia prima actualizada exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->rawMaterialsRepository->delete($id);
            if (!$deleted) {
                return response()->error('Materia prima no encontrada', 404);
            }

            return response()->success([], 'Materia prima eliminada exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
