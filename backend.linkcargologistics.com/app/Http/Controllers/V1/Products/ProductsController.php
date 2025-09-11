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
use App\Repositories\ProductsRepository;
use App\Repositories\ProductCategoriesRepository;
use App\Models\UnifiedLocations;
use App\Models\EventSchedule;
use App\Models\Servicios;
use App\Services\DownloadService;
use Illuminate\Support\Str; 
use App\Models\InventoryItem;
use App\Models\Units;
use App\Models\Products;

class ProductsController extends Controller
{
    protected $productsRepository;
    protected $unifiedLocations;
    protected $eventSchedule;
    protected $productCategoriesRepository;

    public function __construct(
        ProductsRepository $productsRepository,
        UnifiedLocations $unifiedLocations,
        EventSchedule $eventSchedule,
        ProductCategoriesRepository $productCategoriesRepository
    ) {
        $this->productsRepository   = $productsRepository;
        $this->unifiedLocations     = $unifiedLocations;
        $this->eventSchedule        = $eventSchedule;
        $this->productCategoriesRepository        = $productCategoriesRepository;
    }

    public function schedule(Request $request)
    {
        try {
            $data = $request->all();

            $clientId = auth()->id();
            if (!$clientId) {
                return response()->error("No autenticado", 401);
            }

            $product = $this->productsRepository->findById($data["id"]);
            if (!$product) {
                return response()->error("Producto no autorizado", 401);
            }

            $schedule = $this->eventSchedule->updateOrCreate(
                [
                    'client_id'   => $clientId,
                    'provider_id' => $product->user_id,
                    'servicio_id' => $product->id,
                ],
                [
                    'status'       => 'pendiente',
                    'scheduled_at' => null,
                ]
            );

            create_notification([
                'to_user_id'   => $product->user_id,
                'concepto'     => 'Nueva cita agendada',
                'descripcion'  => 'Tienes una nueva solicitud de cita',
                'tipo'         => 'cita',
                'related_type' => $schedule->id,
            ]);

            return response()->success(compact('schedule'), "schedule dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function service(string $id)
    {
        $product = $this->productsRepository->getService($id);
        $gallery = $product->gallery;

        if (!is_array($product->gallery)) {
            $gallery = json_decode($product->gallery);
        }

        $name        = $product->name ?? 'Producto';
        $description = $product->description ?? 'Descripción por defecto';
        $baseUrl     = env('APP_URL');
        $firstImage  = $gallery[0] ?? '';

        $seo = (object) [
            'title'       => $name,
            'description' => $description,
            'openGraph'   => (object) [
                'title'       => $name,
                'description' => $description,
                'image'       => Str::startsWith($firstImage, ['http://', 'https://'])
                    ? $firstImage
                    : $baseUrl . '/' . ltrim($firstImage, '/'),
            ],
        ];

        return response()->success(compact('product', 'seo'), "detalle producto 2025");
    }

    public function related_items(string $slug)
    {
        try {
            $related_items = $this->productsRepository->getBySlug($slug);
            return response()->success(compact('related_items'), "dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function get(DownloadService $downloadService)
    {
        try {
            $products = $this->productsRepository->get();
            return response()->success(compact('products'), "dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {            
            $products = $this->productsRepository->getAll($request);
            return response()->success(compact('products'), "Listado de productos 2025");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $rawGallery = $request->input('gallery');
            // Validar que sea array, si no, convertir en array vacío
            if (!is_array($rawGallery)) {
                $request->merge(['gallery' => []]);
            }

            $validated = $request->validate([
                'name'                     => 'required|string|max:255',
                'description'              => 'nullable|string',
                'product_category_id'      => 'nullable|integer|exists:product_categories,id',
                'rating'                   => 'nullable|integer|min:0|max:5',
                'image'                    => 'nullable|string|max:255',
                'gallery'                  => 'nullable|array',
                'gallery.*'                => 'nullable|string|max:255',

                'barcode'                  => 'nullable|string|max:255',
                'brand'                    => 'nullable|string|max:255',
                'measure_unit'             => 'nullable|in:ml,l,fl_oz,g,kg,gal,oz,lb,cm,ft,in,unit',
                'measure_quantity'         => 'nullable|numeric',
                'short_description'        => 'nullable|string|max:100',
                'long_description'         => 'nullable|string',
                'stock_control'            => 'nullable|boolean',
                'stock_alert_level'        => 'nullable|integer',
                'stock_reorder_amount'     => 'nullable|integer',
                'model'                    => 'nullable|string|max:255',
                'color'                     => 'nullable|string|max:255',
                'sku'                       => 'nullable|string|max:255|unique:products,sku',
                'price'                    => 'nullable|numeric',
                'items'                    => 'nullable|array',
                'items.*.inventory_item_id'=> 'required|integer|exists:inventory_items,id',
                'items.*.unit_id'          => 'required|integer|exists:units,id',
                'items.*.qty'              => 'required|numeric',
                'items.*.waste_pct'        => 'nullable|numeric',
            ]);

            if (empty($validated['sku'])) {
                $validated['sku'] = strtoupper(Str::random(3)) . '-' . rand(1000, 9999);
            }
            
            $validated['user_id'] = $request->user()->id;

            $product = $this->productsRepository->create($validated);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $product->items()->create([
                        'inventory_item_id' => $item['inventory_item_id'],
                        'unit_id'           => $item['unit_id'],
                        'qty'               => $item['qty'],
                        'waste_pct'         => $item['waste_pct'] ?? 0,
                    ]);
                }
            }

            return response()->success(compact('product'), "Producto creado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function fastCreateProduct(Request $request)
    {
        try {
            $rawGallery = $request->input('gallery');
            if (!is_array($rawGallery)) {
                $request->merge(['gallery' => []]);
            }

            $validated = $request->validate([
                'name'                     => 'required|string|max:255',
                'description'              => 'nullable|string',
                'product_category_id'      => 'nullable|integer|exists:product_categories,id',
                'rating'                   => 'nullable|integer|min:0|max:5',
                'image'                    => 'nullable|string|max:255',
                'gallery'                  => 'nullable|array',
                'gallery.*'                => 'nullable|string|max:255',

                'barcode'                  => 'nullable|string|max:255',
                'brand'                    => 'nullable|string|max:255',
                'measure_unit'             => 'nullable|in:ml,l,fl_oz,g,kg,gal,oz,lb,cm,ft,in,unit',
                'measure_quantity'         => 'nullable|numeric',
                'short_description'        => 'nullable|string|max:100',
                'long_description'         => 'nullable|string',
                'stock_control'            => 'nullable|boolean',
                'stock_alert_level'        => 'nullable|integer',
                'stock_reorder_amount'     => 'nullable|integer',
                'model'                    => 'nullable|string|max:255',
                'color'                    => 'nullable|string|max:255',
                'sku'                      => 'nullable|string|max:255|unique:products,sku',
                'price'                    => 'nullable|numeric',
                'items'                    => 'nullable|array',
                'items.*.inventory_item_id'=> 'required|integer|exists:inventory_items,id',
                'items.*.unit_id'          => 'required|integer|exists:units,id',
                'items.*.qty'              => 'required|numeric',
                'items.*.waste_pct'        => 'nullable|numeric',
            ]);

            if (empty($validated['sku'])) {
                $validated['sku'] = strtoupper(Str::random(3)) . '-' . rand(1000, 9999);
            }

            

            $validated['user_id'] = $request->user()->id;

            // 1️⃣ Crear el insumo base en inventory_items
            $inventoryItem = \App\Models\InventoryItem::create([
                'inventory_categories_id'=>1,
                'sku'           => strtoupper(Str::random(3)) . '-' . rand(1000, 9999),
                'base_unit_id'  =>  5,
                'stock'         =>  1,
                'avg_cost'      =>  0,
                'name'          =>  $validated['name'],
                'user_id'       =>  $validated['user_id'],
                'unit_id'       =>  5, // unidad fija
                'qty'           =>  1,
                'category_id'=> $validated['product_category_id'] ?? null,
            ]);

             

            // 2️⃣ Crear el producto usando el insumo recién creado
            $product = $this->productsRepository->create(array_merge($validated, [
                'inventory_item_id' => $inventoryItem->id,
            ]));

           

            // 3️⃣ Crear item por defecto
            $product->items()->create([
                'inventory_item_id' => $inventoryItem->id,
                'unit_id'           => 5,
                'qty'               => 1,
                'waste_pct'         => 0,
            ]);

            // 4️⃣ Crear ítems adicionales si fueron enviados en el request
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $product->items()->create([
                        'inventory_item_id' => $item['inventory_item_id'],
                        'unit_id'           => $item['unit_id'],
                        'qty'               => $item['qty'],
                        'waste_pct'         => $item['waste_pct'] ?? 0,
                    ]);
                }
            }

            return response()->success(compact('product'), "Producto creado exitosamente fastCreateProduct");

        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function show(string $id)
    {
        try {
            $product = $this->productsRepository->findById($id);
            if (!$product && $id !== 'new') {
                return response()->error("Producto no encontrado", 404);
            }

            //$products     =   $this->productsRepository->get();
            $categories     =   $this->productCategoriesRepository->get();
            $raws           =   InventoryItem::with("unit")->orderBy("name")->get();
            $units          =   Units::orderBy("name")->get();

            return response()->success(compact('product', 'categories','raws','units'), "Producto encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update($id, Request $request)
    {
        try {
            $product = Products::with('items')->find($id);
            if (!$product) {
                return response()->error('Producto no encontrado', 404);
            }

            $rawGallery = $request->input('gallery');

            // Validar que sea array, si no, convertir en array vacío
            if (!is_array($rawGallery)) {
                $request->merge(['gallery' => []]);
            }


            $validated = $request->validate([
                'name'                     => 'required|string|max:255',
                'description'              => 'nullable|string',
                'product_category_id'      => 'nullable|integer|exists:product_categories,id',
                'image'                    => 'nullable|string|max:255',
                'gallery'                  => 'nullable|array',
                'gallery.*'                => 'nullable|string|max:255',

                'barcode'                  => 'nullable|string|max:255',
                'brand'                    => 'nullable|string|max:255',
                'measure_unit'             => 'nullable|in:ml,l,fl_oz,g,kg,gal,oz,lb,cm,ft,in,unit',
                'measure_quantity'         => 'nullable|numeric',
                'short_description'        => 'nullable|string|max:100',
                'long_description'         => 'nullable|string',
                'stock_control'            => 'nullable|boolean',
                'stock_alert_level'        => 'nullable|integer',
                'stock_reorder_amount'     => 'nullable|integer',
                'model'                    => 'nullable|string|max:255',
                'color'                    => 'nullable|string|max:255',
                'sku'                      => 'nullable|string|max:255',
                'price'                    => 'nullable|numeric',

                'items'                    => 'nullable|array',
                'items.*.inventory_item_id'=> 'required|integer|exists:inventory_items,id',
                'items.*.unit_id'          => 'required|integer|exists:units,id',
                'items.*.qty'              => 'required|numeric|min:0.001',
                'items.*.waste_pct'        => 'nullable|numeric|min:0|max:100',
            ]);

            $product->update([
                'name'                => $validated['name'],
                'description'         => $validated['description'] ?? null,
                'product_category_id' => $validated['product_category_id'] ?? null,
                'image'               => $validated['image'] ?? null,
                'gallery'             => $validated['gallery'] ?? [],
                'barcode'             => $validated['barcode'] ?? null,
                'brand'               => $validated['brand'] ?? null,
                'measure_unit'        => $validated['measure_unit'] ?? null,
                'measure_quantity'    => $validated['measure_quantity'] ?? null,
                'short_description'   => $validated['short_description'] ?? null,
                'long_description'    => $validated['long_description'] ?? null,
                'stock_control'       => $validated['stock_control'] ?? false,
                'stock_alert_level'   => $validated['stock_alert_level'] ?? 0,
                'stock_reorder_amount'=> $validated['stock_reorder_amount'] ?? 0,
                'model'               => $validated['model'] ?? null,
                'color'               => $validated['color'] ?? null,
                'sku'                 => $validated['sku'] ?? null,
                'price'               => $validated['price'] ?? null,
            ]);
            
            if (!empty($validated['items'])) {
                $product->items()->delete();
                foreach ($validated['items'] as $item) {
                    $product->items()->create([
                        'inventory_item_id' => $item['inventory_item_id'],
                        'unit_id'           => $item['unit_id'],
                        'qty'               => $item['qty'],
                        'waste_pct'         => $item['waste_pct'] ?? 0,
                    ]);
                }
            }

            return $this->show($id);

            return response()->success(
                $product->load(['items.inventoryItem', 'productCategory']),
                "Producto actualizado exitosamente"
            );
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function destroy(string $id)
    {
        try {
            $deleted = $this->productsRepository->delete($id);
            if (!$deleted) {
                return response()->error("Producto no encontrado", 404);
            }

            return response()->success([], "Producto eliminado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
