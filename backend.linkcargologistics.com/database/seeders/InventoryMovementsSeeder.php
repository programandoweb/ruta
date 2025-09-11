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
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class InventoryMovementsSeeder extends Seeder
{
    public function run(): void
    {
        //return;
        $movementsToCreate = 50;                 // cantidad de movimientos
        $types             = ['entrada','salida','ajuste'];
        $locations         = ['Bodega A','Bodega B','Bodega C','Mostrador','Backoffice'];

        $userIds   = DB::table('users')->pluck('id')->all(); // puede estar vacío
        $itemsData = DB::table('inventory_items')->select('id','avg_cost')->get()->toArray();

        if (empty($itemsData)) {
            return;
        }

        for ($i = 0; $i < $movementsToCreate; $i++) {
            DB::transaction(function () use ($types, $locations, $userIds, $itemsData) {

                $type = Arr::random($types);
                $movementId = DB::table('inventory_movements')->insertGetId([
                    'reference'     => 'SEED-'.strtoupper(Str::random(8)),
                    'user_id'       => !empty($userIds) ? Arr::random($userIds) : null,
                    'provider_id'   => null,
                    'client_id'     => null,
                    'movement_date' => Carbon::now()->subDays(rand(0, 60))->toDateString(),
                    'note'          => match ($type) {
                        'entrada' => 'Ingreso automático de seed',
                        'salida'  => 'Salida por seed (simulación venta)',
                        default   => 'Ajuste de inventario por seed',
                    },
                    'type'          => $type,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                $numItems = rand(3, 7);
                $picked   = Arr::random($itemsData, $numItems);
                $rows     = [];

                foreach ((array)$picked as $it) {
                    $baseQty = rand(1, 15);
                    $qty     = match ($type) {
                        'entrada' =>  $baseQty,
                        'salida'  => -$baseQty,                 // salidas negativas
                        'ajuste'  => rand(0,1) ? $baseQty : -$baseQty,
                    };

                    $rows[] = [
                        'inventory_movement_id' => $movementId,
                        'inventory_items_id'    => $it->id,
                        'quantity'              => $qty,
                        'unit_cost'             => $it->avg_cost, // puede ser null
                        'location'              => Arr::random($locations),
                        'created_at'            => now(),
                        'updated_at'            => now(),
                    ];

                    // opcional: reflejar stock acumulado del item
                    DB::table('inventory_items')
                        ->where('id', $it->id)
                        ->update([
                            'stock'      => DB::raw('COALESCE(stock,0) + ('.(int)$qty.')'),
                            'updated_at' => now(),
                        ]);
                }

                DB::table('inventory_movement_items')->insert($rows);
            });
        }
    }
}
