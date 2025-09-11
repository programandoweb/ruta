<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            [
                'label' => 'Aire Libre',
                'grupo' => 'group_areas',
                'items' => [
                    ['label' => 'Venta En Caja', 'grupo' => 'areas'],
                    ['label' => 'Mesa 8', 'grupo' => 'areas'],
                    ['label' => 'Mesa 7', 'grupo' => 'areas'],
                    ['label' => 'Mesa 6', 'grupo' => 'areas'],
                ]
            ],
            [
                'label' => 'Salón Interno',
                'grupo' => 'group_areas',
                'items' => [
                    ['label' => 'Mesa 5', 'grupo' => 'areas'],
                    ['label' => 'Mesa 4', 'grupo' => 'areas'],
                    ['label' => 'Mesa 3', 'grupo' => 'areas'],
                    ['label' => 'Mesa 2', 'grupo' => 'areas'],
                    ['label' => 'Mesa 1', 'grupo' => 'areas'],
                ]
            ],
            [
                'label' => 'Barra',
                'grupo' => 'group_areas',
                'items' => [
                    ['label' => 'Puesto 1', 'grupo' => 'areas'],
                    ['label' => 'Puesto 2', 'grupo' => 'areas'],
                    ['label' => 'Puesto 3', 'grupo' => 'areas'],
                    ['label' => 'Puesto 4', 'grupo' => 'areas'],
                ]
            ],
        ];

        foreach ($areas as $area) {
            $parentId = DB::table('master_tables')->insertGetId([
                'label' => $area['label'],
                'grupo' => $area['grupo'],
            ]);

            foreach ($area['items'] as $item) {
                DB::table('master_tables')->insert([
                    'label' => $item['label'],
                    'grupo' => $item['grupo'],
                    'medida_id' => $parentId,
                ]);
            }
        }
    }
}
