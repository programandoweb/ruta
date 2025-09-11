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

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Products;
use App\Models\ProductsStock;

class ProductsStockSeeder extends Seeder
{
    public function run(): void
    {
        // Productos de ejemplo (ajusta IDs reales de tu tabla products)
        $products = Products::take(10)->get();

        foreach ($products as $product) {
            // Crear 3 movimientos por producto
            ProductsStock::create([
                'product_id' => $product->id,
                'type'       => 'entrada',
                'quantity'   => rand(10, 50),
                'note'       => 'Carga inicial de stock para ' . $product->name,
                'stocked_at' => now(),
            ]);

            ProductsStock::create([
                'product_id' => $product->id,
                'type'       => 'salida',
                'quantity'   => rand(1, 10),
                'note'       => 'Venta inicial de ' . $product->name,
                'stocked_at' => now(),
            ]);

            ProductsStock::create([
                'product_id' => $product->id,
                'type'       => 'ajuste',
                'quantity'   => rand(1, 5),
                'note'       => 'Ajuste de inventario en ' . $product->name,
                'stocked_at' => now(),
            ]);
        }
    }
}
