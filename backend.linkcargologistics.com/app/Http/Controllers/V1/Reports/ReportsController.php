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

namespace App\Http\Controllers\V1\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\InventoryMovementItem;

class ReportsController extends Controller
{
    public function ganancePurchases(Request $request)
    {
        try {
            $rows = \App\Models\Products::select('id', 'name', 'price')
                ->with([
                    'items' => function ($q) {
                        $q->with(['inventoryItem:id,name,avg_cost', 'unit:id,code']);
                    }
                ])
                ->get()
                ->map(function ($product) {
                    $product->total_cost = $product->items->reduce(function ($acc, $item) {
                        $qty = (float) $item->qty;
                        $cost = (float) ($item->inventoryItem->avg_cost ?? 0);
                        return $acc + ($qty * $cost);
                    }, 0);

                    $product->ganancia_neta = round($product->price - $product->total_cost, 2);

                    $product->porcentaje_ganancia = $product->total_cost > 0
                        ? round(($product->ganancia_neta / $product->total_cost) * 100, 2)
                        : 0;

                    return $product;
                });

            return response()->success(compact('rows'), 'Productos con ganancias calculadas');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }







    public function inventory_status(Request $request)
    {
        try {
            $raws = InventoryMovementItem::select(
                        'inventory_items_id',
                        DB::raw("SUM(CASE WHEN im.type = 'entrada' THEN quantity ELSE 0 END) as total_entradas"),
                        DB::raw("SUM(CASE WHEN im.type = 'salida' THEN quantity ELSE 0 END) as total_salidas"),
                        DB::raw("SUM(CASE WHEN im.type = 'ajuste' THEN quantity ELSE 0 END) as ajustes"),
                        DB::raw("MAX(unit_cost) as ultimo_costo_unitario")
                    )
                    ->with(["product"])
                    ->join('inventory_movements as im', 'inventory_movement_items.inventory_movement_id', '=', 'im.id')
                    ->groupBy('inventory_items_id')
                    ->get()
                    ->map(function ($item) {
                        $item->stock_actual = $item->total_entradas - $item->total_salidas + $item->ajustes;
                        $item->valor_estimado = $item->stock_actual * $item->ultimo_costo_unitario;
                        return $item;
                    });

            return response()->success(compact('raws'), "Resumen de inventario");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function inventory_movements(Request $request)
    {
        try {
            $raws = \App\Models\InventoryMovement::with([
                'user:id,name',
                'provider:id,name',
                'items' => function ($q) {
                    $q->with('product:id,name');
                }
            ])
            ->orderByDesc('movement_date')
            ->get();

            return response()->success(compact('raws'), 'Historial de movimientos');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function kardex(Request $request)
    {
        try {
            $kardex = \App\Models\InventoryMovementItem::with([
                    'movement' => function ($q) {
                        $q->select('id', 'movement_date', 'type', 'reference', 'user_id', 'provider_id')
                        ->with([
                            'user:id,name',
                            'provider:id,name',
                        ]);
                    },
                    'product:id,name'
                ])
                ->orderBy('inventory_items_id')
                ->orderBy('created_at')
                ->get();

            return response()->success(compact('kardex'), 'Kardex general por insumo');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function providerPurchases(Request $request)
    {
        try {
            $purchases = InventoryMovementItem::select(
                    'im.provider_id',
                    'u.name as provider_name',
                    DB::raw('SUM(inventory_movement_items.quantity) as total_quantity'),
                    DB::raw('SUM(inventory_movement_items.quantity * inventory_movement_items.unit_cost) as total_value')
                )
                ->join('inventory_movements as im', 'inventory_movement_items.inventory_movement_id', '=', 'im.id')
                ->leftJoin('users as u', 'im.provider_id', '=', 'u.id')
                ->where('im.type', 'entrada')
                ->whereNotNull('im.provider_id')
                ->groupBy('im.provider_id', 'u.name')
                ->orderByDesc('total_value')
                ->get();

            return response()->success(compact('purchases'), 'Compras agrupadas por proveedor');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }




}
