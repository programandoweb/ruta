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
use App\Models\ProductsItem; // pivote receta: product_id ↔ inventory_items_id, quantity (consumo por unidad)
use App\Repositories\InventoryMovementsRepository;
use Illuminate\Support\Facades\DB;

interface InventoryConsumptionServiceInterface
{
    public function consumeForOrderItem(int $orderItemId, ?int $userId = null): ?InventoryMovement;
    public function revertForOrderItem(int $orderItemId, ?int $userId = null): ?InventoryMovement;
}
