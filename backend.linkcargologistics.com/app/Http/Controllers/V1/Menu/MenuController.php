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

namespace App\Http\Controllers\V1\Menu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\ProductsRepository;
use App\Models\MasterTable;
use App\Models\CashShift;
use App\Services\Cash\CashServiceInterface;
use App\Models\RouteItem;
use App\Models\Routes;


class MenuController extends Controller
{
    protected $productsRepository;
    protected $cash;

    public function __construct(
        ProductsRepository $productsRepository,
        CashServiceInterface $cash
    ) {
        $this->productsRepository = $productsRepository;
        $this->cash = $cash;
    }

    public function menu()
    {
        try {
            $menu = $this->productsRepository->getMenu();

            $categories = MasterTable::with(['childrens' => function ($q) {
                $q->select('id', 'label', 'grupo', 'medida_id');
            }])
                ->where('grupo', 'group_areas')
                ->select('id', 'label', 'grupo')
                ->get();

            $orders = \App\Models\Orders::with('items', 'user:id,name')
                ->latest()
                ->get();

            return response()->success(
                compact('menu', 'categories', 'orders'),
                'Menú obtenido correctamente'
            );
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function getInit()
    {
        try {
            // 1️⃣ Verificar si hay caja abierta
            $shiftId = $this->cash->currentOpenShiftId();
            if (!$shiftId) {
                return response()->success([
                    'status' => 'closed',
                    'menu' => [],
                    'categories' => [],
                    'byDay' => [],
                ], 'No hay caja abierta.');
            }

            // 2️⃣ Caja abierta → devolver menú y categorías
            $menu = $this->productsRepository->getMenu();

            $categories = MasterTable::with(['childrens' => function ($q) {
                $q->select('id', 'label', 'grupo', 'medida_id');
            }])
                ->where('grupo', 'group_areas')
                ->select('id', 'label', 'grupo')
                ->get();

            $byDay = MasterTable::with(['childrens' => function ($q) {
                $q->select('id', 'label', 'grupo', 'medida_id');
            }])
                ->where('grupo', 'group_areas')
                ->select('id', 'label', 'grupo')
                ->get();

            return response()->success(
                [
                    'status' => 'open',
                    'menu' => $menu,
                    'categories' => $categories,
                    'byDay' => $byDay,
                ],
                'Datos maestros del sistema (caja abierta)'
            );
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }




    public function routeByGuide(Request $request)
    {
        try {

            $validated = $request->validate([
                'guide' => 'required|string|max:255',
            ]);

            // 🔎 Buscar item por guía remota
            $routeItem = RouteItem::where('guide_remote', $validated['guide'])
                ->with('route') // relación con routes
                ->first();

            if (!$routeItem) {
                return response()->error(
                    'No se encontró ninguna ruta asociada a esta guía.',
                    404
                );
            }

            // 🔁 Traer ruta completa con sus items
            $route = Routes::with('items')
                ->find($routeItem->route_id);

            return response()->success(
                [
                    'route'      => $route,
                    'route_item' => $routeItem,
                ],
                'Ruta encontrada por número de guía.'
            );

        } catch (\Throwable $e) {
            return response()->error(
                $e->getMessage(),
                $e->getCode() ?: 422
            );
        }
    }

}
