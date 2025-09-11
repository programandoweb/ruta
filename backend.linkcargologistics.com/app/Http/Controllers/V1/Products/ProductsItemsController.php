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

namespace App\Http\Controllers\V1\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductsItem;
use App\Models\InventoryItem;
use App\Models\Units;

class ProductsItemsController extends Controller
{
    public function index($productId)
    {
        try {
            $items = ProductsItem::with(['inventory', 'unit'])
                ->where('product_id', $productId)
                ->get();

            return response()->success(compact('items'));
        } catch (\Throwable $th) {
            return response()->error($th->getMessage());
        }
    }

    public function store(Request $request, $productId)
    {
        try {
            $data = $request->validate([
                'inventory_item_id' => ['required', 'integer', 'exists:inventory_items,id'],
                'qty'               => ['required', 'numeric', 'min:0.01'],
                'unit_id'           => ['required', 'integer', 'exists:units,id'],
                'note'              => ['nullable', 'string', 'max:255'],
                'product_id'        => ['nullable'],
            ]);

            $item = ProductsItem::updateOrCreate(
                [
                    'product_id'        => $data['product_id'],
                    'inventory_item_id' => $data['inventory_item_id'],
                ],
                [
                    'qty'      => $data['qty'],
                    'unit_id'  => $data['unit_id'],
                    'note'     => $data['note'] ?? null,
                ]
            );

            $items  =   ProductsItem::with(["inventoryItem"])->where("product_id",$data['product_id'])->get();

            return response()->success(compact('item',"items"), 'Ítem agregado correctamente');
        } catch (\Throwable $th) {
            return response()->error($th->getMessage());
        }
    }



    public function destroy($id)
    {
        try {
            $item = ProductsItem::findOrFail($id);
            $productId = $item->product_id;
            $item->delete();

            // Obtener nuevamente la lista de items del producto
            $items = ProductsItem::get();

            return response()->success(['items' => $items], 'Ítem eliminado correctamente');
        } catch (\Throwable $th) {
            return response()->error($th->getMessage());
        }
    }

}
