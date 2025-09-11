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

namespace App\Http\Controllers\V1\Orders;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\OrdersRepository;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as DomPDF;
use Illuminate\Support\Facades\Storage;
use App\Services\Cash\CashServiceInterface;
use App\Services\Inventory\InventoryConsumptionService;
use App\Repositories\InventoryCategoriesRepository;

class OrdersController extends Controller
{
    protected $ordersRepository;
    protected CashServiceInterface $cash;
    protected InventoryConsumptionService $inventory;
    protected $categoriesRepository;
    

    public function __construct(    OrdersRepository $ordersRepository, 
                                    CashServiceInterface $cash,
                                    InventoryConsumptionService $inventory,
                                    InventoryCategoriesRepository $categoriesRepository
                                )
    {
        $this->ordersRepository         = $ordersRepository;
        $this->cash                     = $cash;
        $this->inventory                = $inventory;
        $this->categoriesRepository     = $categoriesRepository;
    }

    public function index(Request $request)
    {
        try {
            $orders = $this->ordersRepository->getAll($request);
            return response()->success(compact('orders'), "Listado de órdenes");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id'        => 'nullable|exists:users,id',
                'customer_name'  => 'nullable|string|max:255',
                'status'         => 'nullable|in:En Espera,Abierta,Pausada,Pendiente de Pago,Pagada,Cancelada,Cerrada',
                'scheduled_at'   => 'nullable|date',
                'total_price'    => 'nullable|numeric|min:0',
                'payment_method' => 'nullable|string|max:100',
                'notes'          => 'nullable|string',
            ]);

            $order = $this->ordersRepository->create($validated);
            return response()->success(compact('order'), "Orden creada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $order = $this->ordersRepository->findById($id);
            if (!$order) {
                //return response()->error("Orden no encontrada", 404);
            }

            return response()->success(compact('order'), "Orden encontrada Show");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function showByTable(Request $request)
    {
        try {
            // 👉 tomar el último segmento de la URL
            $lastSegment = $request->segment(count($request->segments()));

            // 👉 convertir mesa_263 → 263
            $mesaId = (int) str_replace('mesa_', '', $lastSegment);

            $order = \App\Models\Orders::where('table_id', $mesaId)
                    ->whereIn('status', ['Abierta'])
                    ->with(['items', 'user:id,name', 'paids'])
                    ->latest()
                    ->first();

            if ($order) {
                // forzar a que se cargue paids por item
                $order->items->each(function ($item) {
                    $item->paids = $item->paids; // dispara el accesor
                });

                // añadimos los campos calculados solo si existe
                $order->total_paid = $order->total_paid ?? null;
                $order->remaining  = $order->remaining ?? null;
            }

            $categories = $this->categoriesRepository->get();

            return response()->success(
                compact('order','categories'),
                "Orden encontrada showByTable"
            );
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }




    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'user_id'        => 'sometimes|nullable|exists:users,id',
                'customer_name'  => 'nullable|string|max:255',
                'status'         => 'nullable|in:En Espera,Abierta,Pausada,Pendiente de Pago,Pagada,Cancelada,Cerrada',
                'scheduled_at'   => 'nullable|date',
                'total_price'    => 'nullable|numeric|min:0',
                'payment_method' => 'nullable|string|max:100',
                'notes'          => 'nullable|string',
            ]);

            $order = $this->ordersRepository->update($id, $validated);
            if (!$order) {
                return response()->error("Orden no encontrada", 404);
            }

            return response()->success(compact('order'), "Orden actualizada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $order = $this->ordersRepository->findById($id);
            if (!$order) {
                return response()->error("Orden no encontrada", 404);
            }

            // 👉 Actualizamos el estatus en lugar de borrar
            $order = $this->ordersRepository->update($id, [
                'status' => 'Cancelada'
            ]);

            return response()->success(compact('order'), "Orden cancelada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function add_item(Request $request)
    {
        try {
            $validated = $request->validate([
                'table_id'        => 'required|string',
                'user_id'         => 'nullable|exists:users,id',
                'customer_name'   => 'nullable|string|max:255',
                'item.id'         => 'nullable|integer',
                'item.name'       => 'required|string|max:255',
                'item.category'   => 'nullable|string|max:255',
                'item.quantity'   => 'required|integer|min:1',
                'item.price'      => 'required|numeric|min:0',
                'item.description'=> 'nullable|string',
            ]);

            // 👉 Convertir "mesa_263" en 263
            $mesaId = (int) str_replace('mesa_', '', $validated['table_id']);

            $userId         =   Auth::id();
            $customerName   =   $item['description'] ?? null; // 👈 description se usa como customer_name

            // 🔎 Buscar orden existente en la mesa
            $order = \App\Models\Order::where('table_id', $mesaId)
                ->whereIn('status', ['Abierta', 'Pausada'])
                ->latest()
                ->first();

            if (!$order) {
                // 👉 Generar código único aleatorio (ej: ad57ewq8a)
                do {
                    $code = Str::lower(Str::random(10)); // 10 chars
                } while (\App\Models\Order::where('code', $code)->exists());

                // Crear la orden
                $order = \App\Models\Order::create([
                    'user_id'       => $userId ?? null,
                    'customer_name' => $validated['customer_name'] ?? null,
                    'table_id'      => $mesaId,
                    'status'        => 'Abierta',
                    'total_price'   => 0,
                    'code'          => $code, // 👈 importante
                ]);
            }

            $total = $order->total_price ?? 0;

            // Extraer item del request
            $item       =   $request->input('item');
            $subtotal   =   $item['price'] * $item['quantity'];

            // Insertar ítem
            \App\Models\OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item['id'] ?? null,
                'name'       => $item['name'],
                'category'   => $item['category'] ?? null,
                'quantity'   => $item['quantity'],
                'price'      => $item['price'],
                'description'=> $item['description'] ?? null,
                'subtotal'   => $subtotal,
            ]);

            $total += $subtotal;

            // Actualizar total de la orden
            $order->update(['total_price' => $total]);

            $items  =   \App\Models\OrderItem::where("order_id",$order->id)->get();

            //Lógica para descontar del inventario
            $this->inventory->consumeForOrderItem($order->id, $userId);

            return response()->success(compact('order','item','items'), "Ítem agregado a la orden cancelada exitosamente");            
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function remove_item(Request $request, string $id)
    {
        try {
            // Buscar ítem
            $item = \App\Models\OrderItem::find($id);
            if (!$item) {
                return response()->error("Ítem no encontrado", 404);
            }

            // Obtener la orden asociada
            $order = \App\Models\Order::find($item->order_id);
            if (!$order) {
                return response()->error("Orden asociada no encontrada", 404);
            }

            // Actualizar estatus del ítem y registrar quién lo canceló
            $item->update([
                'status'        => 'Cancelada',
                'delete_by_id'  => \Auth::id(),
            ]);

            // Recalcular total de la orden (solo ítems activos/no cancelados)
            $nuevoTotal = \App\Models\OrderItem::where('order_id', $order->id)
                ->where('status', '!=', 'Cancelada')
                ->sum('subtotal');

            $order->update(['total_price' => $nuevoTotal]);

            // Obtener ítems actualizados de la orden
            $items = \App\Models\OrderItem::where("order_id", $order->id)->get();

            return response()->success(compact('order', 'items'), "Ítem cancelado correctamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    
    

    public function print_group(Request $request)
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array|min:1',
                'items.*' => 'integer|exists:order_items,id',
            ]);

            $items = \App\Models\OrderItem::with('order')
                ->whereIn('id', $validated['items'])
                ->get();

            if ($items->isEmpty()) {
                return response()->error("No se encontraron ítems", 404);
            }

            $order = $items->first()->order;
            if (!$order) {
                return response()->error("Orden no encontrada", 404);
            }

            // Obtener empresa desde Servicios
            $enterprise = \App\Models\Servicios::where('type', "services")
                ->where('user_id', \Auth::id())
                ->first();

            if (!$enterprise) {
                return response()->error("No se encontró la empresa asociada", 404);
            }

            // Adaptamos a estructura simple
            $order->enterprise = [
                'Nombre'        => $enterprise->name,
                'Descripción'   => $enterprise->description,
                'Ubicación'     => $enterprise->location,
                'Teléfono'      => $enterprise->contact_phone,
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.ticket_order_items', [
                'order' => $order,
                'items' => $items,
            ]);

            // Ticket size ~ 80mm de ancho
            $pdf->setPaper([0, 0, 226.77, 800], 'portrait');

            // Guardar en public
            $fileName = 'ticket_items_' . $order->id . '_' . time() . '.pdf';
            $directory = public_path('pdf/orders');

            if (!file_exists($directory)) {
                mkdir($directory, 0775, true);
            }

            $pdf->save($directory . '/' . $fileName);

            $url = url('pdf/orders/' . $fileName);

            return response()->success([
                'pdf_url' => $url,
                'order'   => $order,
                'items'   => $items,
            ], "Ticket generado correctamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function pay_group(Request $request)
    {
        try {
            $validated = $request->validate([
                'items'   => 'required|array|min:1',
                'items.*' => 'integer|exists:order_items,id',
            ]);

            // Buscar ítems seleccionados
            $items = \App\Models\OrderItem::whereIn('id', $validated['items'])->get();

            if ($items->isEmpty()) {
                return response()->error("No se encontraron ítems", 404);
            }

            // Todos los ítems deben pertenecer a la misma orden
            $order = $items->first()->order;
            if (!$order) {
                //return response()->error("Orden no encontrada", 404);
            }

            // Marcar los ítems como pagados
            foreach ($items as $item) {
                $item->update([
                    'status' => 'Pagada',
                ]);
            }

            // Recalcular total de la orden (solo ítems no cancelados)
            $nuevoTotal = \App\Models\OrderItem::where('order_id', $order->id)
                ->where('status', '!=', 'Cancelada')
                ->sum('subtotal');

            $order->update(['total_price' => $nuevoTotal]);

            // Obtener ítems actualizados
            $updatedItems = \App\Models\OrderItem::where("order_id", $order->id)->get();

            return response()->success([
                'order' => $order,
                'items' => $updatedItems
            ], "Grupo de ítems pagado correctamente");

        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function close(Request $request)
    {
        try {
            $validated = $request->validate([
                'table_id' => 'required|string'
            ]);

            // 👉 convertir mesa_263 → 263
            $mesaId = (int) str_replace('mesa_', '', $validated['table_id']);

            // Buscar orden abierta en esa mesa
            $order = \App\Models\Order::where('table_id', $mesaId)
                ->whereIn('status', ['Abierta', 'Pausada', 'Pagada'])
                ->latest()
                ->first();

            if (!$order) {
                return response()->error("No se encontró una orden activa para esta mesa", 404);
            }

            // Verificar que todos los ítems estén pagados
            $items = \App\Models\OrderItem::where('order_id', $order->id)->get();

            if ($items->isEmpty()) {
                return response()->error("La orden no tiene ítems", 400);
            }

            $noPagados = $items->whereNotIn('status', ['Pagada', 'Cancelada']);

            if ($noPagados->count() > 0) {
                return response()->error("Existen ítems sin pagar. No se puede cerrar la mesa.", 400);
            }

            // Totalizar con los ítems pagados
            $totalPagado = $items->where('status', 'Pagada')->sum('subtotal');

            // Actualizar estado de la orden a "Cerrada"
            $order->update([
                'status' => 'Cerrada',
                'total_price' => $totalPagado
            ]);

            return response()->success(compact('order', 'items'), "Mesa cerrada correctamente ✅");

        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function sales(Request $request)
    {
        try {
            $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
            $status  = $request->input('status'); 
            $from    = $request->input('from');   
            $to      = $request->input('to');     

            $query = \App\Models\Order::select([
                    'id',
                    'code as Código',
                    //'table_id as Mesa',
                    //'user_id as Usuario',
                    //'customer_name as Cliente',
                    'status as Estado',
                    'total_price as Precio_Total',
                    //'created_at as Fecha_Creación',
                    'updated_at as Última_Actualización'
                ]);

            // 🔎 filtro por status
            if (!empty($status)) {
                $query->where('status', $status);
            }

            // 🔎 filtro por rango de fechas
            if (!empty($from) && !empty($to)) {
                $query->whereBetween('created_at', [$from, $to]);
            } elseif (!empty($from)) {
                $query->whereDate('created_at', '>=', $from);
            } elseif (!empty($to)) {
                $query->whereDate('created_at', '<=', $to);
            }

            $sales = $query->latest()->paginate($perPage);

            return response()->success(compact('sales'), "Listado de ventas");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function sales_by_id($id)
    {
        try {
            $order = \App\Models\Order::with([
                    'user:id,name',
                    'items' // incluir ítems de la orden
                ])
                ->select([
                    'id',
                    'code as Código',
                    //'table_id as Mesa',
                    //'user_id as Usuario',
                    //'customer_name as Cliente',
                    'status as Estado',
                    'total_price as Precio_Total',
                    //'created_at as Fecha_Creación',
                    'updated_at as Última_Actualización'
                ])
                ->find($id);

            if (!$order) {
                return response()->error("Venta no encontrada", 404);
            }

            return response()->success(compact('order'), "Detalle de la venta");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function register_payment(Request $request)
    {
        try {
            $validated = $request->validate([
                'items'    => 'required|array|min:1',
                'items.*'  => 'integer|exists:order_items,id',
                'table_id' => 'required|string',
                'amount'   => 'required|numeric|min:0',
                'method'   => 'required|string|max:100',
                'note'     => 'nullable|string|max:255',
            ]);

            $items = \App\Models\OrderItem::whereIn('id', $validated['items'])->get();

            if ($items->isEmpty()) {
                return response()->error("No se encontraron ítems", 404);
            }

            $order = $items->first()->order;
            if (!$order) {
                //return response()->error("Orden no encontrada", 404);
            }

            // convertir mesa_264 → 264
            $mesaId = (int) str_replace('mesa_', '', $validated['table_id']);

            // Guardar registro de pago
            $paid = \App\Models\OrderPaid::create([
                'order_id' => $order->id,
                'user_id'  => \Auth::id(),
                'table_id' => $mesaId,
                'amount'   => $validated['amount'],
                'method'   => $validated['method'],
                'note'     => $validated['note'] ?? null,
                'items'    => json_encode($validated['items']),
            ]);

            // ⬇️ NUEVO: si es efectivo, vincular a caja
            $cashMovement = null;
            if (strtolower($validated['method']) === 'efectivo') {
                // usar shift abierto o abrir uno con fondo fijo (200.000) si no existe
                $shiftId = $this->cash->currentOpenShiftId();
                if (!$shiftId) {
                    $shift = $this->cash->openShift(Auth::id(), 200000.00);
                    $shiftId = $shift->id;
                }
                // registrar ingreso en caja asociado al pago
                $cashMovement = $this->cash->attachOrderPaid($shiftId, $paid);
            }

            // Calcular cuánto suman todos los pagos hechos para estos ítems
            $totalPagado = \App\Models\OrderPaid::where('order_id', $order->id)
                ->get()
                ->sum('amount');

            $subtotalItems = $items->sum('subtotal');

            // Si lo pagado >= subtotal de esos ítems → marcarlos como pagados
            if ($totalPagado >= $subtotalItems) {
                foreach ($items as $item) {
                    $item->update([
                        'status' => 'Pagada',
                    ]);
                }
            }

            // Recalcular total de la orden (solo ítems no cancelados)
            $nuevoTotal = \App\Models\OrderItem::where('order_id', $order->id)
                ->where('status', '!=', 'Cancelada')
                ->sum('subtotal');

            $order->update(['total_price' => $nuevoTotal]);

            $updatedItems = \App\Models\OrderItem::where("order_id", $order->id)->get();

            return response()->success([
                'order'  => $order,
                'items'  => $updatedItems,
                'paid'   => $paid,
            ], "Pago registrado correctamente ✅");

        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }




}
