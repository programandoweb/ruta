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
}
