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

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Products;
use App\Models\ProductsStock;
use App\Models\Servicios;
use App\Models\ProductCategory;
use Illuminate\Support\Str;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name'     => 'Proveedor BBQ',
            'email'    => 'proveedor@bbq.com',
            'password' => bcrypt('12345678'),
        ]);

        $items = [
            ['Alitas BBQ', 'Clásicas', ''],
            ['Alitas Picantes', 'Hot', ''],
            ['Alipapas', 'Mixtas', ''],
            ['Papas Fritas', 'Corte Tradicional', ''],
            ['Hamburguesa Artesanal', 'Carne de Res', ''],
            ['Hamburguesa de Pollo', 'Pollo Crispy', ''],
            ['Mazorca Desgranada', 'Con Queso', ''],
            ['Salchipapas', 'Especiales', ''],
            ['Aros de Cebolla', 'Empanizados', ''],
            ['Nuggets de Pollo', 'Caseros', ''],
            ['Costillas BBQ', 'Medio Rack', ''],
        ];

        // Mapa de productos -> categoría
        $categoryMap = [
            'Alitas BBQ'             => 'Alitas',
            'Alitas Picantes'        => 'Alitas',
            'Alipapas'               => 'Acompañamientos',
            'Papas Fritas'           => 'Acompañamientos',
            'Hamburguesa Artesanal'  => 'Hamburguesas',
            'Hamburguesa de Pollo'   => 'Hamburguesas',
            'Mazorca Desgranada'     => 'Acompañamientos',
            'Salchipapas'            => 'Acompañamientos',
            'Aros de Cebolla'        => 'Acompañamientos',
            'Nuggets de Pollo'       => 'Acompañamientos',
            'Costillas BBQ'          => 'Alitas',
        ];

        foreach ($items as [$name, $model, $color]) {
            $categoryName = $categoryMap[$name] ?? 'Acompañamientos';
            $category = ProductCategory::firstOrCreate(['name' => $categoryName]);

            // Crear servicio principal de tipo producto
            $servicio = Servicios::create([
                'user_id'             => 10,
                'name'                => $name,
                'description'         => $model,
                'type'                => 'products',
                'rating'              => null,
                'image'               => null,
                'location'            => null,
                'map'                 => null,
                'gallery'             => null,
                'category_id'         => null,
                'product_category_id' => $category->id,
            ]);

            // Crear producto relacionado
            $product = Products::create([
                //'servicio_id'             => $servicio->id,
                'name'                    => $name,
                'barcode'                 => strtoupper(Str::random(12)),
                'brand'                   => 'BBQ House',
                'measure_unit'            => 'unit',
                'measure_quantity'        => 1,
                'short_description'       => $model,
                'long_description'        => 'Producto: ' . $name . ' - ' . $model,
                //'category_name'           => $categoryName,
                'stock_control'           => true,
                'stock_current'           => 0,
                'stock_alert_level'       => 5,
                'stock_reorder_amount'    => 10,
                'stock_notifications_enabled' => true,
                'model'                   => $model,
                'color'                   => $color,
                'sku'                     => strtoupper(Str::random(10)),
                'stock'                   => 0,
                'min_stock'               => 5,
                'price'                   => rand(10000, 50000) / 100,
                'provider_id'             => 10,
                'product_category_id'     => $category->id,
            ]);

            $stockQty = rand(20, 50);

            ProductsStock::create([
                'product_id' => $product->id,
                'type'       => 'entrada',
                'quantity'   => $stockQty,
                'note'       => 'Carga inicial (simulada)',
                'stocked_at' => now(),
            ]);

            $product->stock = $stockQty;
            $product->stock_current = $stockQty;
            $product->save();
        }

        $this->command->info('Productos de restaurante creados correctamente con categorías para el negocio de alitas BBQ.');
    }
}
