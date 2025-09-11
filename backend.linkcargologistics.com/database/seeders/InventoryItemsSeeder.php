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
use Illuminate\Support\Facades\DB;

class InventoryItemsSeeder extends Seeder
{
    public function run()
    {
        // Crear categoría por defecto
        $categoryId = DB::table('inventory_categories')->insertGetId([
            'name' => 'General',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insertar unidades base
        $units = [
            ['code' => 'g',  'name' => 'Gramo',     'ratio_to_base' => 0.001],
            ['code' => 'kg', 'name' => 'Kilogramo', 'ratio_to_base' => 1],
            ['code' => 'ml', 'name' => 'Mililitro', 'ratio_to_base' => 0.001],
            ['code' => 'l',  'name' => 'Litro',     'ratio_to_base' => 1],
            ['code' => 'ud', 'name' => 'Unidad',    'ratio_to_base' => 1],
        ];

        foreach ($units as $unit) {
            DB::table('units')->updateOrInsert(
                ['code' => $unit['code']],
                [
                    'name' => $unit['name'],
                    'ratio_to_base' => $unit['ratio_to_base'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $units = DB::table('units')->pluck('id', 'code');

        $items = [
            ['sku' => 'CHK-WING-001', 'name' => 'Alitas de Pollo', 'unit' => 'kg', 'stock' => 50, 'avg_cost' => 14000],
            ['sku' => 'CHK-THGH-002', 'name' => 'Muslos de Pollo', 'unit' => 'kg', 'stock' => 30, 'avg_cost' => 12000],
            ['sku' => 'SCE-BBQ-003',  'name' => 'Salsa BBQ', 'unit' => 'ml', 'stock' => 5000, 'avg_cost' => 25],
            ['sku' => 'SCE-HOT-004',  'name' => 'Salsa Picante', 'unit' => 'ml', 'stock' => 3000, 'avg_cost' => 20],
            ['sku' => 'SCE-GAR-005',  'name' => 'Salsa de Ajo', 'unit' => 'ml', 'stock' => 2500, 'avg_cost' => 22],
            ['sku' => 'SCE-MST-006',  'name' => 'Mostaza', 'unit' => 'ml', 'stock' => 2000, 'avg_cost' => 18],
            ['sku' => 'SCE-MIEL-007', 'name' => 'Miel', 'unit' => 'ml', 'stock' => 1500, 'avg_cost' => 35],
            ['sku' => 'OIL-VEG-008',  'name' => 'Aceite Vegetal', 'unit' => 'l', 'stock' => 20, 'avg_cost' => 10000],
            ['sku' => 'BUT-009',      'name' => 'Mantequilla', 'unit' => 'g', 'stock' => 10000, 'avg_cost' => 45],
            ['sku' => 'FLO-WHT-010',  'name' => 'Harina de Trigo', 'unit' => 'kg', 'stock' => 15, 'avg_cost' => 4000],
            ['sku' => 'FLO-MAI-011',  'name' => 'Maicena', 'unit' => 'g', 'stock' => 3000, 'avg_cost' => 10],
            ['sku' => 'GAR-FSH-012',  'name' => 'Ajo Fresco', 'unit' => 'g', 'stock' => 500, 'avg_cost' => 20],
            ['sku' => 'ONI-WHT-013',  'name' => 'Cebolla Blanca', 'unit' => 'g', 'stock' => 1500, 'avg_cost' => 12],
            ['sku' => 'CHE-GRT-014',  'name' => 'Queso Rallado', 'unit' => 'g', 'stock' => 3000, 'avg_cost' => 55],
            ['sku' => 'VEG-LEC-015',  'name' => 'Lechuga', 'unit' => 'g', 'stock' => 1000, 'avg_cost' => 10],
            ['sku' => 'VEG-TMT-016',  'name' => 'Tomate', 'unit' => 'g', 'stock' => 1500, 'avg_cost' => 9],
            ['sku' => 'BRD-HMB-017',  'name' => 'Pan Hamburguesa', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 450],
            ['sku' => 'BRD-HOT-018',  'name' => 'Pan Perro Caliente', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 400],
            ['sku' => 'NCH-019',      'name' => 'Nachos', 'unit' => 'g', 'stock' => 2000, 'avg_cost' => 20],
            ['sku' => 'GCM-020',      'name' => 'Guacamole', 'unit' => 'ml', 'stock' => 1500, 'avg_cost' => 45],
            ['sku' => 'JLP-021',      'name' => 'Jalapeños', 'unit' => 'g', 'stock' => 800, 'avg_cost' => 30],
            ['sku' => 'PTT-022',      'name' => 'Papas a la francesa', 'unit' => 'kg', 'stock' => 25, 'avg_cost' => 6000],
            ['sku' => 'SPC-SAL-023',  'name' => 'Sal', 'unit' => 'g', 'stock' => 1000, 'avg_cost' => 1],
            ['sku' => 'SPC-PPR-024',  'name' => 'Pimienta Negra', 'unit' => 'g', 'stock' => 800, 'avg_cost' => 8],
            ['sku' => 'PKG-BXS-025',  'name' => 'Cajas para llevar', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 500],
            ['sku' => 'PKG-CRT-026',  'name' => 'Cartón Aluminio', 'unit' => 'ud', 'stock' => 150, 'avg_cost' => 400],
            ['sku' => 'TSPN-027',     'name' => 'Cucharas Desechables', 'unit' => 'ud', 'stock' => 300, 'avg_cost' => 50],
            ['sku' => 'FRK-028',      'name' => 'Tenedores Desechables', 'unit' => 'ud', 'stock' => 300, 'avg_cost' => 50],
            ['sku' => 'NPLN-029',     'name' => 'Servilletas', 'unit' => 'ud', 'stock' => 1000, 'avg_cost' => 20],
        ];

        foreach ($items as $item) {
            // 1. Insertar producto en inventory_items
            $itemId = DB::table('inventory_items')->insertGetId([
                'sku' => $item['sku'],
                'name' => $item['name'],
                'inventory_categories_id' => $categoryId,
                'base_unit_id' => $units[$item['unit']] ?? null,
                'stock' => $item['stock'],
                'avg_cost' => $item['avg_cost'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Crear un movimiento de entrada
            $movementId = DB::table('inventory_movements')->insertGetId([
                'reference'     => 'SEED-' . strtoupper(Str::random(6)),
                'user_id'       => 1, // ajusta al usuario que hace la carga inicial
                'provider_id'   => null,
                'client_id'     => null,
                'movement_date' => now(),
                'note'          => 'Carga inicial de inventario para ' . $item['name'],
                'type'          => 'entrada',
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            // 3. Insertar 10 movimientos de ítems (simulación de entradas)
            for ($i = 1; $i <= 10; $i++) {
                DB::table('inventory_movement_items')->insert([
                    'inventory_movement_id' => $movementId,
                    'inventory_items_id'    => $itemId,
                    'quantity'              => rand(1, 50), // cantidad aleatoria para simular
                    'unit_cost'             => $item['avg_cost'],
                    'location'              => 'Bodega ' . $i,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ]);
            }
        }

    }
}
