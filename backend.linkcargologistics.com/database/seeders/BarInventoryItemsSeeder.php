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
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Products;
use App\Models\ProductsItem;
use App\Models\ProductsStock;
use App\Models\Servicios;
use App\Models\ProductCategory;

class BarInventoryItemsSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * =========================================================
         * 1. CREAR UNIDADES Y MATERIAS PRIMAS
         * =========================================================
         */
        $categoryId = DB::table('inventory_categories')->insertGetId([
            'name'       => 'General',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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
                    'name'        => $unit['name'],
                    'ratio_to_base' => $unit['ratio_to_base'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }

        $units = DB::table('units')->pluck('id', 'code');

        // Materias primas (costos ajustados a Colombia 2025)
        $inventoryItems = [
            ['sku' => 'BEV-CER-001', 'name' => '3 Cordilleras (Rosada)', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 5000],
            ['sku' => 'MIX-CAF-002', 'name' => 'Affogato (Café Expreso Con Helado)', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 5000],
            ['sku' => 'BEV-AGU-003', 'name' => 'Aguardiente amarillo (Botella)', 'unit' => 'ud', 'stock' => 20, 'avg_cost' => 47500],
            ['sku' => 'BEV-AGU-004', 'name' => 'Aguardiente amarillo (Media Botella)', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 27500],
            ['sku' => 'BEV-AGU-005', 'name' => 'Aguardiente antioqueño (Botella)', 'unit' => 'ud', 'stock' => 20, 'avg_cost' => 47500],
            ['sku' => 'BEV-AGU-006', 'name' => 'Aguardiente antioqueño (Media Botella)', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 27500],
            ['sku' => 'BEV-AGU-007', 'name' => 'Aguardiente antioqueño (Trago)', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 3500],
            ['sku' => 'MIX-COC-008', 'name' => 'Alexander', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 12000],
            ['sku' => 'MIX-INF-009', 'name' => 'Aromática (Manzanilla, Cidrón, Limoncillo, Hierbabuena)', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 1250],
            ['sku' => 'BEV-BYL-010', 'name' => 'Baileys (Botella)', 'unit' => 'ud', 'stock' => 15, 'avg_cost' => 55000],
            ['sku' => 'BEV-BYL-011', 'name' => 'Baileys (Media Botella)', 'unit' => 'ud', 'stock' => 25, 'avg_cost' => 40000],
            ['sku' => 'BEV-BYL-012', 'name' => 'Baileys (Trago)', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 4500],
            ['sku' => 'MIX-COC-013', 'name' => 'Blue hawai', 'unit' => 'ud', 'stock' => 35, 'avg_cost' => 12000],
            ['sku' => 'BEV-AGU-014', 'name' => 'Botella de agua', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 1250],
            ['sku' => 'BEV-BRA-015', 'name' => 'Brandy domecq (Botella)', 'unit' => 'ud', 'stock' => 10, 'avg_cost' => 50000],
            ['sku' => 'BEV-BRA-016', 'name' => 'Brandy domecq (Media Botella)', 'unit' => 'ud', 'stock' => 15, 'avg_cost' => 30000],
            ['sku' => 'BEV-BRA-017', 'name' => 'Brandy domecq (Trago)', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 3500],
            ['sku' => 'BEV-BUC-018', 'name' => 'Buchanans (Trago)', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 8500],
            ['sku' => 'MIX-CAF-019', 'name' => 'Café americano', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 2000],
            ['sku' => 'MIX-CAF-020', 'name' => 'Café bombom', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 3500],
            ['sku' => 'MIX-CAF-021', 'name' => 'Café expresso', 'unit' => 'ud', 'stock' => 90, 'avg_cost' => 1500],
            ['sku' => 'MIX-CAF-022', 'name' => 'Café irlandés', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 7500],
            ['sku' => 'MIX-CAF-023', 'name' => 'Café latte', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 3250],
            ['sku' => 'MIX-CAF-024', 'name' => 'Capuccino', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 4000],
            ['sku' => 'MIX-CAF-025', 'name' => 'Capuccino con licor', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 6250],
            ['sku' => 'MIX-CAF-026', 'name' => 'Carajillo', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 6000],
            ['sku' => 'BEV-CER-027', 'name' => 'Cerveza grande (1 lt)', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 4500],
            ['sku' => 'BEV-CER-028', 'name' => 'Club colombia (Dorada, Roja, Negra)', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 3500],
            ['sku' => 'BEV-SNA-029', 'name' => 'Coca cola', 'unit' => 'ud', 'stock' => 150, 'avg_cost' => 2500],
            ['sku' => 'BEV-SNA-030', 'name' => 'Coco', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 6500],
            ['sku' => 'MIX-COC-031', 'name' => 'Coctel smirnoff (Roja)', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 12000],
            ['sku' => 'MIX-COC-032', 'name' => 'Coctel smirnoff (Verde)', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 12000],
            ['sku' => 'MIX-COC-033', 'name' => 'Copa de sangría', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 7500],
            ['sku' => 'BEV-CER-034', 'name' => 'Corona', 'unit' => 'ud', 'stock' => 120, 'avg_cost' => 6000],
            ['sku' => 'MIX-COC-035', 'name' => 'Corona margarita', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 15000],
            ['sku' => 'BEV-CER-036', 'name' => 'Coronita', 'unit' => 'ud', 'stock' => 120, 'avg_cost' => 4000],
            ['sku' => 'BEV-SNA-037', 'name' => 'Gatorade', 'unit' => 'ud', 'stock' => 150, 'avg_cost' => 3000],
            ['sku' => 'MIX-GRA-038', 'name' => 'Granizado de café', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-GRA-039', 'name' => 'Granizado de chocolate', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-GRA-040', 'name' => 'Granizado de frutas (Mora, Maracuyá, Guanábana, Mango O Fresa)', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 8000],
            ['sku' => 'MIX-GRA-041', 'name' => 'Granizado de milo', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-INF-042', 'name' => 'Infusión de frutos rojos', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 5000],
            ['sku' => 'MIX-JUG-043', 'name' => 'Jugo en leche', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 5000],
            ['sku' => 'MIX-JUG-044', 'name' => 'Jugos en agua (Mora, Maracuyá, Guanábana, Mango O Fresa)', 'unit' => 'ud', 'stock' => 90, 'avg_cost' => 4500],
            ['sku' => 'MIX-LIM-045', 'name' => 'Limonada de café', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 5000],
            ['sku' => 'MIX-LIM-046', 'name' => 'Limonada de cherry', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 5000],
            ['sku' => 'MIX-LIM-047', 'name' => 'Limonada de hierbabuena', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 4500],
            ['sku' => 'MIX-LIM-048', 'name' => 'Limonada de mango biche', 'unit' => 'ud', 'stock' => 60, 'avg_cost' => 5000],
            ['sku' => 'MIX-LIM-049', 'name' => 'Limonada de vinotinto', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 6000],
            ['sku' => 'MIX-LIM-050', 'name' => 'Limonada natural', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 4500],
            ['sku' => 'MIX-MAL-051', 'name' => 'Malteada de baileys', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 10000],
            ['sku' => 'MIX-MAL-052', 'name' => 'Malteada de café', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-MAL-053', 'name' => 'Malteada de fresa', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-MAL-054', 'name' => 'Malteada de maracuyá', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-MAL-055', 'name' => 'Malteada de oreo', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8000],
            ['sku' => 'MIX-COC-056', 'name' => 'Margarita (Blue)', 'unit' => 'ud', 'stock' => 35, 'avg_cost' => 12000],
            ['sku' => 'MIX-COC-057', 'name' => 'Margarita (De Mango)', 'unit' => 'ud', 'stock' => 35, 'avg_cost' => 12000],
            ['sku' => 'MIX-BEB-058', 'name' => 'Milo caliente', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 5000],
            ['sku' => 'BEV-SNA-059', 'name' => 'Milo frío', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 5500],
            ['sku' => 'MIX-CAF-060', 'name' => 'Mocaccino', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 4750],
            ['sku' => 'MIX-COC-061', 'name' => 'Mojito cubano', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 10000],
            ['sku' => 'BEV-WHS-062', 'name' => 'Old Parr (Trago)', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 8500],
            ['sku' => 'MIX-COC-063', 'name' => 'Orgasmo tequila', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 12000],
            ['sku' => 'MIX-COC-064', 'name' => 'Pantera rosa', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 12000],
            ['sku' => 'MIX-COC-065', 'name' => 'Piña colada', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 6500],
            ['sku' => 'BEV-CER-066', 'name' => 'Pilsen', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 3000],
            ['sku' => 'BEV-CER-067', 'name' => 'Poker', 'unit' => 'ud', 'stock' => 120, 'avg_cost' => 3500],
            ['sku' => 'BEV-CER-068', 'name' => 'Redds', 'unit' => 'ud', 'stock' => 90, 'avg_cost' => 3500],
            ['sku' => 'BEV-RON-069', 'name' => 'Ron viejo de caldas (Botella)', 'unit' => 'ud', 'stock' => 15, 'avg_cost' => 47500],
            ['sku' => 'BEV-RON-070', 'name' => 'Ron viejo de caldas (Media Botella)', 'unit' => 'ud', 'stock' => 20, 'avg_cost' => 27500],
            ['sku' => 'BEV-RON-071', 'name' => 'Ron viejo de caldas (Trago)', 'unit' => 'ud', 'stock' => 70, 'avg_cost' => 3500],
            ['sku' => 'MIX-COC-072', 'name' => 'Sex on the beach', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 12000],
            ['sku' => 'BEV-VDK-073', 'name' => 'Smirnoff', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 7000],
            ['sku' => 'BEV-SNA-074', 'name' => 'Soda', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 3250],
            ['sku' => 'BEV-SNA-075', 'name' => 'Soda saborizada (Frutos Rojos Y Amarillos)', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 6500],
            ['sku' => 'BEV-CER-076', 'name' => 'Stella artois', 'unit' => 'ud', 'stock' => 100, 'avg_cost' => 4500],
            ['sku' => 'MIX-JUG-077', 'name' => 'Tamarindo', 'unit' => 'ud', 'stock' => 80, 'avg_cost' => 3250],
            ['sku' => 'MIX-INF-078', 'name' => 'Te chai', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 4500],
            ['sku' => 'BEV-TQL-079', 'name' => 'Tequila jimador (Trago)', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 6000],
            ['sku' => 'BEV-TQL-080', 'name' => 'Tequila Jose Cuervo (Trago)', 'unit' => 'ud', 'stock' => 30, 'avg_cost' => 5500],
            ['sku' => 'MIX-COC-081', 'name' => 'Tequila sunrise', 'unit' => 'ud', 'stock' => 40, 'avg_cost' => 12000],
            ['sku' => 'BEV-VDK-082', 'name' => 'Vodka (Trago)', 'unit' => 'ud', 'stock' => 50, 'avg_cost' => 4000],
            ['sku' => 'BEV-CER-083', 'name' => 'Águila light', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 3500],
            ['sku' => 'BEV-CER-084', 'name' => 'Águila original', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 3500],
            ['sku' => 'OTR-CIG-085', 'name' => 'Cigarrillo individual', 'unit' => 'ud', 'stock' => 200, 'avg_cost' => 500],
            ['sku' => 'OTR-HAL-086', 'name' => 'Caramelo Halls', 'unit' => 'ud', 'stock' => 300, 'avg_cost' => 200],
            ['sku' => 'OTR-CHI-087', 'name' => 'Chiclets Trident', 'unit' => 'ud', 'stock' => 250, 'avg_cost' => 300],
            ['sku' => 'OTR-CHI-088', 'name' => 'bon bon bum', 'unit' => 'ud', 'stock' => 12, 'avg_cost' => 200],
            ];


        $inventoryItems2=[];
        foreach ($inventoryItems as $item) {
            $id = DB::table('inventory_items')->insertGetId([
                'sku'                     => $item['sku'],
                'name'                    => $item['name'],
                'inventory_categories_id' => $categoryId,
                'base_unit_id'            => $units[$item['unit']] ?? null,
                'stock'                   => $item['stock'],
                'avg_cost'                => $item['avg_cost'],
                'created_at'              => now(),
                'updated_at'              => now(),
            ]);
            $inventoryItems2[] = $id; // guardar solo el ID
        }

        /**
         * =========================================================
         * 2. CREAR PRODUCTOS DE VENTA Y SERVICIOS (PRECIOS REALES)
         * =========================================================
         */
        $user = User::factory()->create([
            'name'     => 'Proveedor Bar',
            'email'    => 'proveedor@bar.com',
            'password' => bcrypt('12345678'),
        ]);

        $products = [
            ['3 Cordilleras (Rosada)', '', 'Cervezas'],
            ['Affogato (Café Expreso Con Helado)', '', 'Cafés'],
            ['Aguardiente amarillo (Botella)', '', 'Licores'],
            ['Aguardiente amarillo (Media Botella)', '', 'Licores'],
            ['Aguardiente antioqueño (Botella)', '', 'Licores'],
            ['Aguardiente antioqueño (Media Botella)', '', 'Licores'],
            ['Aguardiente antioqueño (Trago)', '', 'Licores'],
            ['Alexander', '', 'Cócteles'],
            ['Aromática (Manzanilla, Cidrón, Limoncillo, Hierbabuena)', '', 'Infusiones'],
            ['Baileys (Botella)', '', 'Licores'],
            ['Baileys (Media Botella)', '', 'Licores'],
            ['Baileys (Trago)', '', 'Licores'],
            ['Blue hawai', '', 'Cócteles'],
            ['Botella de agua', '', 'Sin Alcohol'],
            ['Brandy domecq (Botella)', '', 'Licores'],
            ['Brandy domecq (Media Botella)', '', 'Licores'],
            ['Brandy domecq (Trago)', '', 'Licores'],
            ['Buchanans (Trago)', '', 'Whiskies'],
            ['Café americano', '', 'Cafés'],
            ['Café bombom', '', 'Cafés'],
            ['Café expresso', '', 'Cafés'],
            ['Café irlandés', '', 'Cafés'],
            ['Café latte', '', 'Cafés'],
            ['Capuccino', '', 'Cafés'],
            ['Capuccino con licor', '', 'Cafés'],
            ['Carajillo', '', 'Cafés'],
            ['Cerveza grande (1 lt)', '', 'Cervezas'],
            ['Club colombia (Dorada, Roja, Negra)', '', 'Cervezas'],
            ['Coca cola', '', 'Sin Alcohol'],
            ['Coco', '', 'Sin Alcohol'],
            ['Coctel smirnoff (Roja)', '', 'Cócteles'],
            ['Coctel smirnoff (Verde)', '', 'Cócteles'],
            ['Copa de sangría', '', 'Cócteles'],
            ['Corona', '', 'Cervezas'],
            ['Corona margarita', '', 'Cócteles'],
            ['Coronita', '', 'Cervezas'],
            ['Gatorade', '', 'Sin Alcohol'],
            ['Granizado de café', '', 'Granizados'],
            ['Granizado de chocolate', '', 'Granizados'],
            ['Granizado de frutas (Mora, Maracuyá, Guanábana, Mango O Fresa)', '', 'Granizados'],
            ['Granizado de milo', '', 'Granizados'],
            ['Infusión de frutos rojos', '', 'Infusiones'],
            ['Jugo en leche', '', 'Jugos'],
            ['Jugos en agua (Mora, Maracuyá, Guanábana, Mango O Fresa)', '', 'Jugos'],
            ['Limonada de café', '', 'Limonadas'],
            ['Limonada de cherry', '', 'Limonadas'],
            ['Limonada de hierbabuena', '', 'Limonadas'],
            ['Limonada de mango biche', '', 'Limonadas'],
            ['Limonada de vinotinto', '', 'Limonadas'],
            ['Limonada natural', '', 'Limonadas'],
            ['Malteada de baileys', '', 'Malteadas'],
            ['Malteada de café', '', 'Malteadas'],
            ['Malteada de fresa', '', 'Malteadas'],
            ['Malteada de maracuyá', '', 'Malteadas'],
            ['Malteada de oreo', '', 'Malteadas'],
            ['Margarita (Blue)', '', 'Cócteles'],
            ['Margarita (De Mango)', '', 'Cócteles'],
            ['Milo caliente', '', 'Bebidas Calientes'],
            ['Milo frío', '', 'Sin Alcohol'],
            ['Mocaccino', '', 'Cafés'],
            ['Mojito cubano', '', 'Cócteles'],
            ['Old Parr (Trago)', '', 'Whiskies'],
            ['Orgasmo tequila', '', 'Cócteles'],
            ['Pantera rosa', '', 'Cócteles'],
            ['Piña colada', '', 'Cócteles'],
            ['Pilsen', '', 'Cervezas'],
            ['Poker', '', 'Cervezas'],
            ['Redds', '', 'Cervezas'],
            ['Ron viejo de caldas (Botella)', '', 'Rones'],
            ['Ron viejo de caldas (Media Botella)', '', 'Rones'],
            ['Ron viejo de caldas (Trago)', '', 'Rones'],
            ['Sex on the beach', '', 'Cócteles'],
            ['Smirnoff', '', 'Vodkas'],
            ['Soda', '', 'Sin Alcohol'],
            ['Soda saborizada (Frutos Rojos Y Amarillos)', '', 'Sin Alcohol'],
            ['Stella artois', '', 'Cervezas'],
            ['Tamarindo', '', 'Jugos'],
            ['Te chai', '', 'Infusiones'],
            ['Tequila jimador (Trago)', '', 'Tequilas'],
            ['Tequila Jose Cuervo (Trago)', '', 'Tequilas'],
            ['Tequila sunrise', '', 'Cócteles'],
            ['Vodka (Trago)', '', 'Vodkas'],
            ['Águila light', '', 'Cervezas'],
            ['Águila original', '', 'Cervezas'],
            ['Cigarrillo individual', '', 'Otros'],
            ['Caramelo Halls', '', 'Otros'],
            ['Chiclets Trident', '', 'Otros'],
            ['bon bon bum', '', 'Otros'],
        ];





        // Precios reales de referencia en COP
        $productPrices = [
            '3 Cordilleras (Rosada)' => 10000,
            'Affogato (Café Expreso Con Helado)' => 10000,
            'Aguardiente amarillo (Botella)' => 95000,
            'Aguardiente amarillo (Media Botella)' => 55000,
            'Aguardiente antioqueño (Botella)' => 95000,
            'Aguardiente antioqueño (Media Botella)' => 55000,
            'Aguardiente antioqueño (Trago)' => 7000,
            'Alexander' => 24000,
            'Aromática (Manzanilla, Cidrón, Limoncillo, Hierbabuena)' => 2500,
            'Baileys (Botella)' => 110000,
            'Baileys (Media Botella)' => 80000,
            'Baileys (Trago)' => 9000,
            'Blue hawai' => 24000,
            'Botella de agua' => 2500,
            'Brandy domecq (Botella)' => 100000,
            'Brandy domecq (Media Botella)' => 60000,
            'Brandy domecq (Trago)' => 7000,
            'Buchanans (Trago)' => 17000,
            'Café americano' => 4000,
            'Café bombom' => 7000,
            'Café expresso' => 3000,
            'Café irlandés' => 15000,
            'Café latte' => 6500,
            'Capuccino' => 8000,
            'Capuccino con licor' => 12500,
            'Carajillo' => 12000,
            'Cerveza grande (1 lt)' => 9000,
            'Club colombia (Dorada, Roja, Negra)' => 7000,
            'Coca cola' => 5000,
            'Coco' => 13000,
            'Coctel smirnoff (Roja)' => 24000,
            'Coctel smirnoff (Verde)' => 24000,
            'Copa de sangría' => 15000,
            'Corona' => 12000,
            'Corona margarita' => 30000,
            'Coronita' => 8000,
            'Gatorade' => 6000,
            'Granizado de café' => 16000,
            'Granizado de chocolate' => 16000,
            'Granizado de frutas (Mora, Maracuyá, Guanábana, Mango O Fresa)' => 16000,
            'Granizado de milo' => 16000,
            'Infusión de frutos rojos' => 10000,
            'Jugo en leche' => 10000,
            'Jugos en agua (Mora, Maracuyá, Guanábana, Mango O Fresa)' => 9000,
            'Limonada de café' => 10000,
            'Limonada de cherry' => 10000,
            'Limonada de hierbabuena' => 9000,
            'Limonada de mango biche' => 10000,
            'Limonada de vinotinto' => 12000,
            'Limonada natural' => 9000,
            'Malteada de baileys' => 20000,
            'Malteada de café' => 16000,
            'Malteada de fresa' => 16000,
            'Malteada de maracuyá' => 16000,
            'Malteada de oreo' => 16000,
            'Margarita (Blue)' => 24000,
            'Margarita (De Mango)' => 24000,
            'Milo caliente' => 10000,
            'Milo frío' => 11000,
            'Mocaccino' => 9500,
            'Mojito cubano' => 20000,
            'Old Parr (Trago)' => 17000,
            'Orgasmo tequila' => 24000,
            'Pantera rosa' => 24000,
            'Piña colada' => 13000,
            'Pilsen' => 6000,
            'Poker' => 7000,
            'Redds' => 7000,
            'Ron viejo de caldas (Botella)' => 95000,
            'Ron viejo de caldas (Media Botella)' => 55000,
            'Ron viejo de caldas (Trago)' => 7000,
            'Sex on the beach' => 24000,
            'Smirnoff' => 14000,
            'Soda' => 6500,
            'Soda saborizada (Frutos Rojos Y Amarillos)' => 13000,
            'Stella artois' => 9000,
            'Tamarindo' => 6500,
            'Te chai' => 9000,
            'Tequila jimador (Trago)' => 12000,
            'Tequila Jose Cuervo (Trago)' => 11000,
            'Tequila sunrise' => 24000,
            'Vodka (Trago)' => 8000,
            'Águila light' => 7000,
            'Águila original' => 7000,
            'Cigarrillo individual' => 1000,
            'Caramelo Halls'        => 500,
            'Chiclets Trident'      => 800,
            'bon bon bum'           => 500,
        ];



        $productCosts = [
            '3 Cordilleras (Rosada)' => 5000,
            'Affogato (Café Expreso Con Helado)' => 5000,
            'Aguardiente amarillo (Botella)' => 47500,
            'Aguardiente amarillo (Media Botella)' => 27500,
            'Aguardiente antioqueño (Botella)' => 47500,
            'Aguardiente antioqueño (Media Botella)' => 27500,
            'Aguardiente antioqueño (Trago)' => 3500,
            'Alexander' => 12000,
            'Aromática (Manzanilla, Cidrón, Limoncillo, Hierbabuena)' => 1250,
            'Baileys (Botella)' => 55000,
            'Baileys (Media Botella)' => 40000,
            'Baileys (Trago)' => 4500,
            'Blue hawai' => 12000,
            'Botella de agua' => 1250,
            'Brandy domecq (Botella)' => 50000,
            'Brandy domecq (Media Botella)' => 30000,
            'Brandy domecq (Trago)' => 3500,
            'Buchanans (Trago)' => 8500,
            'Café americano' => 2000,
            'Café bombom' => 3500,
            'Café expresso' => 1500,
            'Café irlandés' => 7500,
            'Café latte' => 3250,
            'Capuccino' => 4000,
            'Capuccino con licor' => 6250,
            'Carajillo' => 6000,
            'Cerveza grande (1 lt)' => 4500,
            'Club colombia (Dorada, Roja, Negra)' => 3500,
            'Coca cola' => 2500,
            'Coco' => 6500,
            'Coctel smirnoff (Roja)' => 12000,
            'Coctel smirnoff (Verde)' => 12000,
            'Copa de sangría' => 7500,
            'Corona' => 6000,
            'Corona margarita' => 15000,
            'Coronita' => 4000,
            'Gatorade' => 3000,
            'Granizado de café' => 8000,
            'Granizado de chocolate' => 8000,
            'Granizado de frutas (Mora, Maracuyá, Guanábana, Mango O Fresa)' => 8000,
            'Granizado de milo' => 8000,
            'Infusión de frutos rojos' => 5000,
            'Jugo en leche' => 5000,
            'Jugos en agua (Mora, Maracuyá, Guanábana, Mango O Fresa)' => 4500,
            'Limonada de café' => 5000,
            'Limonada de cherry' => 5000,
            'Limonada de hierbabuena' => 4500,
            'Limonada de mango biche' => 5000,
            'Limonada de vinotinto' => 6000,
            'Limonada natural' => 4500,
            'Malteada de baileys' => 10000,
            'Malteada de café' => 8000,
            'Malteada de fresa' => 8000,
            'Malteada de maracuyá' => 8000,
            'Malteada de oreo' => 8000,
            'Margarita (Blue)' => 12000,
            'Margarita (De Mango)' => 12000,
            'Milo caliente' => 5000,
            'Milo frío' => 5500,
            'Mocaccino' => 4750,
            'Mojito cubano' => 10000,
            'Old Parr (Trago)' => 8500,
            'Orgasmo tequila' => 12000,
            'Pantera rosa' => 12000,
            'Piña colada' => 6500,
            'Pilsen' => 3000,
            'Poker' => 3500,
            'Redds' => 3500,
            'Ron viejo de caldas (Botella)' => 47500,
            'Ron viejo de caldas (Media Botella)' => 27500,
            'Ron viejo de caldas (Trago)' => 3500,
            'Sex on the beach' => 12000,
            'Smirnoff' => 7000,
            'Soda' => 3250,
            'Soda saborizada (Frutos Rojos Y Amarillos)' => 6500,
            'Stella artois' => 4500,
            'Tamarindo' => 3250,
            'Te chai' => 4500,
            'Tequila jimador (Trago)' => 6000,
            'Tequila Jose Cuervo (Trago)' => 5500,
            'Tequila sunrise' => 12000,
            'Vodka (Trago)' => 4000,
            'Águila light' => 3500,
            'Águila original' => 3500,
            'Cigarrillo individual' => 500,
            'Caramelo Halls'        => 200,
            'Chiclets Trident'      => 300,
            'bon bon bum'           => 200,
        ];


        $index=0;

        foreach ($products as [$name, $model, $categoryName]) {
            $category = ProductCategory::firstOrCreate(['name' => $categoryName]);

            $servicio = Servicios::create([
                'user_id'             => $user->id,
                'name'                => $name,
                'description'         => $model,
                'type'                => 'products',
                'product_category_id' => $category->id,
            ]);

            $product = Products::create([
                'name'                => $name,
                'barcode'             => strtoupper(Str::random(12)),
                'brand'               => 'Bar House',
                'measure_unit'        => 'unit',
                'measure_quantity'    => 1,
                'short_description'   => $model,
                'long_description'    => 'Producto: ' . $name . ' - ' . $model,
                'stock_control'       => true,
                'stock_current'       => 0,
                'stock_alert_level'   => 5,
                'stock_reorder_amount'=> 10,
                'model'               => $model,
                'sku'                 => strtoupper(Str::random(10)),
                'stock'               => 0,
                'min_stock'           => 5,
                'price'                 => $productPrices[$name] ?? 10000,
                'cost'                  => $productCosts[$name] ?? 10000,
                'provider_id'           => $user->id,
                'product_category_id'   => $category->id,
            ]);

            $stockQty = rand(10, 50);
            
            $this->command->info($inventoryItems2[$index]);

            ProductsItem::create([
                'product_id'        => $product->id,
                'inventory_item_id' => $inventoryItems2[$index], // ahora es el ID directo
                'unit_id'           => 5, // revisa si aquí realmente es el id de unidad
                'qty'               => 1,
                'waste_pct'         => 0,
            ]);

            ProductsStock::create([
                'product_id' => $product->id,
                'type'       => 'entrada',
                'quantity'   => $stockQty,
                'note'       => 'Carga inicial bebidas/cócteles',
                'stocked_at' => now(),
            ]);

            $product->update([
                'stock'         => $stockQty,
                'stock_current' => $stockQty,
            ]);

            $index++;
        }

        $this->command->info('Seeder maestro ejecutado: Unidades, materias primas y productos de bar creados con precios realistas e inventario positivo.');
    }
}
