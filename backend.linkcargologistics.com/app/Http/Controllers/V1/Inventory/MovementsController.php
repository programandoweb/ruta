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
use App\Repositories\InventoryMovementsRepository;
use App\Models\Units;
use App\Models\InventoryItem;
use App\Models\User;

class MovementsController extends Controller
{
    protected $movementsRepository;

    public function __construct(InventoryMovementsRepository $movementsRepository)
    {
        $this->movementsRepository = $movementsRepository;
    }

    public function index(Request $request)
    {
        try {
            $movements = $this->movementsRepository->getAll($request);
            return response()->success(compact('movements'), 'Listado de movimientos');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type'          => 'required|in:entrada,salida,ajuste',
                'user_id'       => 'required|exists:users,id',
                'provider_id'   => 'nullable|exists:users,id',
                'client_id'     => 'nullable|exists:users,id',
                'reference'     => 'nullable|string|max:255',
                'movement_date' => 'required|date',
                'note'          => 'nullable|string',
                'items'         => 'required|array|min:1',

                // aceptar product_id del payload y validarlo contra inventory_items
                'items.*.product_id'      => 'required|exists:inventory_items,id',
                'items.*.quantity'        => 'required|numeric', // permite negativos/decimales
                'items.*.unit_cost'       => 'nullable|numeric|min:0',
                'items.*.location'        => 'nullable|string|max:255',
            ]);

            // normalizar items: product_id -> inventory_items_id
            $validated['items'] = collect($validated['items'])->map(function ($it) {
                return [
                    'inventory_items_id' => (int)$it['product_id'],
                    'quantity'           => (float)$it['quantity'],
                    'unit_cost'          => isset($it['unit_cost']) ? (float)$it['unit_cost'] : null,
                    'location'           => $it['location'] ?? null,
                ];
            })->all();

            $movement = $this->movementsRepository->createWithItems($validated);

            return response()->success(compact('movement'), 'Movimiento registrado correctamente');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function show(string $id)
    {
        try {
            $movement = $this->movementsRepository->findByIdWithItems($id);

            if (!$movement && $id != 'new') {
                return response()->error('Movimiento no encontrado show', 404);
            }

            $raws = InventoryItem::select('id', 'name', 'base_unit_id', 'stock as minimum_stock')
                                    ->with('unit')
                                    ->withSum('movementItems as available_stock', 'quantity')
                                    ->orderBy('name')
                                    ->get();


            $units      =   Units::select("id", "name")->orderBy("name")->get();
            $providers  =   User::role('providers')
                                ->select('id', 'name')
                                ->orderBy('name')
                                ->get();

            $clients    =   User::role('clients')
                                ->select('id', 'name')
                                ->orderBy('name')
                                ->get();

            return response()->success(compact('movement', 'units', 'raws', 'providers', 'clients'), 'Movimiento encontrado');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->movementsRepository->delete($id);
            if (!$deleted) {
                return response()->error('Movimiento no encontrado delete', 404);
            }

            return response()->success([], 'Movimiento eliminado exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
