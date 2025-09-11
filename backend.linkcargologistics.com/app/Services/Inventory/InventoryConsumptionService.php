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

namespace App\Services\Inventory;

use App\Models\OrderItem;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\ProductsItem;
use App\Repositories\InventoryMovementsRepository;
use Illuminate\Support\Facades\DB;

class InventoryConsumptionService implements InventoryConsumptionServiceInterface
{
    public function __construct(
        protected InventoryMovementsRepository $movements
    ) {}

    public function consumeForOrderItem(int $orderItemId, ?int $userId = null): ?InventoryMovement
    {
        return DB::transaction(function () use ($orderItemId, $userId) {
            $orderItem = OrderItem::with('order')->findOrFail($orderItemId);
            
            $ref = 'ORDER_ITEM:' . $orderItem->id;

            // Verificar si ya existe movimiento para este ORDER_ITEM
            $movement = InventoryMovement::where('reference', $ref)->first();

            // receta del producto → materias primas
            $recipe = ProductsItem::where('product_id', $orderItem->product_id)->get();
            if ($recipe->isEmpty()) {
                return null;
            }

            $items = [];
            foreach ($recipe as $r) {
                $qty = (int) ceil(($r->quantity ?? 0) * (int) $orderItem->quantity);

                $inv = InventoryItem::where('id', $r->id)->lockForUpdate()->first();
                if ($inv) {
                    $inv->update(['stock' => ($inv->stock ?? 0) - $qty]);
                }

                $items[] = [
                    'inventory_items_id' => $r->inventory_item_id,
                    'quantity'           => -$orderItem->quantity,            // salida negativa (consumo)
                    'unit_cost'          => $inv->avg_cost ?? null,
                    'location'           => 'Consumo de producción',
                ];
            }

            if (empty($items)) return null;

            if ($movement) {
                // 👉 Ya existe → solo insertar nuevos items
                foreach ($items as $item) {
                    $movement->items()->create($item);
                }
            } else {
                // 👉 No existe → crear movimiento nuevo
                $movement = $this->movements->createWithItems([
                    'type'          => 'salida',
                    'user_id'       => $userId,
                    'provider_id'   => null,
                    'client_id'     => null,
                    'reference'     => $ref,
                    'movement_date' => now()->toDateString(),
                    'note'          => 'Consumo por pedido #' . ($orderItem->order?->id ?? 'N/A'),
                    'items'         => $items,
                ]);
            }

            return $movement->load('items.product');
        });
    }


    public function revertForOrderItem(int $orderItemId, ?int $userId = null): ?InventoryMovement
    {
        return DB::transaction(function () use ($orderItemId, $userId) {
            $orderItem = OrderItem::with('order')->findOrFail($orderItemId);

            // evitar doble reverso
            $ref = 'ORDER_ITEM_CANCEL:' . $orderItem->id;
            if ($exists = InventoryMovement::where('reference', $ref)->first()) {
                return $exists->load('items.product');
            }

            $recipe = ProductsItem::where('product_id', $orderItem->product_id)->get();
            if ($recipe->isEmpty()) return null;

            $items = [];
            foreach ($recipe as $r) {
                $qty = (int) ceil(($r->quantity ?? 0) * (int) $orderItem->quantity);
                if ($qty <= 0) continue;

                $inv = InventoryItem::where('id', $r->inventory_items_id)->lockForUpdate()->first();
                if ($inv) {
                    $inv->update(['stock' => ($inv->stock ?? 0) + $qty]);
                }

                $items[] = [
                    'inventory_items_id' => $r->inventory_items_id,
                    'quantity'           => +$qty,            // entrada para revertir
                    'unit_cost'          => $inv->avg_cost ?? null,
                    'location'           => 'Reverso consumo por cancelación',
                ];
            }

            if (empty($items)) return null;

            $movement = $this->movements->createWithItems([
                'type'          => 'entrada',
                'user_id'       => $userId,
                'reference'     => $ref,
                'movement_date' => now()->toDateString(),
                'note'          => 'Reverso consumo por cancelación ítem pedido #' . $orderItem->id,
                'items'         => $items,
            ]);

            return $movement;
        });
    }
}
