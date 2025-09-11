<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Repositories;

use App\Models\InventoryMovement;
use App\Models\InventoryMovementItem;
use Illuminate\Support\Facades\DB;

class InventoryMovementsRepository
{
    public function getAll($request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 10));
        $query   = InventoryMovement::query();

        // Detectar tipo por segmento de la URL
        $path = $request->path(); // ejemplo: dashboard/inventory/entries

        if (str_contains($path, 'entries')) {
            $query->where('type', 'entrada');
        } elseif (str_contains($path, 'exits')) {
            $query->where('type', 'salida');
        } elseif (str_contains($path, 'adjustments')) {
            $query->where('type', 'ajuste');
        }

        // Filtro por búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                ->orWhere('note', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage)->through(function ($movement) {
            return [
                'id'             => $movement->id,
                'reference'      => $movement->reference,
                'movement_date'  => $movement->movement_date,
                'note'           => $movement->note,
            ];
        });
    }




    public function findByIdWithItems($id)
    {
        return InventoryMovement::with('items.product')->find($id);
    }

    public function createWithItems(array $data)
    {
        return DB::transaction(function () use ($data) {
            $movement = InventoryMovement::create([
                'type'          => $data['type'],
                'user_id'       => $data['user_id'],
                'provider_id'   => $data['provider_id'] ?? null,
                'client_id'     => $data['client_id'] ?? null,
                'reference'     => $data['reference'] ?? null,
                'movement_date' => $data['movement_date'],
                'note'          => $data['note'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                InventoryMovementItem::create([
                    'inventory_movement_id' => $movement->id,
                    'inventory_items_id'    => $item['inventory_items_id'],
                    'quantity'              => $item['quantity'],
                    'unit_cost'             => $item['unit_cost'] ?? null,
                    'location'              => $item['location'] ?? null,
                ]);
            }

            return $movement->load('items.product');
        });
    }

    public function delete($id)
    {
        return InventoryMovement::where('id', $id)->delete();
    }
}
