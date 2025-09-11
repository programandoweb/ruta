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
use Carbon\Carbon;

class CashSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario simulado
        $userId = DB::table('users')->inRandomOrder()->value('id') ?? 1;

        // 1. Crear turno de caja abierto
        $shiftId = DB::table('cash_shifts')->insertGetId([
            'opened_by'             => $userId,
            'opening_amount'        => 200000, // Fondo fijo de caja
            'closing_amount_expected'=> null,
            'closing_amount_real'   => null,
            'opened_at'             => Carbon::now()->subHours(6),
            'status'                => 'open',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        // 2. Registrar movimiento de apertura
        DB::table('cash_movements')->insert([
            'cash_shift_id' => $shiftId,
            'type'          => 'apertura',
            'amount'        => 200000,
            'method'        => 'efectivo',
            'reference'     => 'fondo fijo inicial',
            'note'          => 'Apertura de caja con fondo fijo de $200.000',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        // 3. Registrar algunos ingresos por ventas
        for ($i = 1; $i <= 5; $i++) {
            DB::table('cash_movements')->insert([
                'cash_shift_id' => $shiftId,
                'type'          => 'ingreso',
                'amount'        => rand(10000, 80000),
                'method'        => 'efectivo',
                'reference'     => 'venta_mesa_' . $i,
                'note'          => 'Pago en efectivo de mesa ' . $i,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }

        // 4. Registrar un egreso (retiro de caja chica)
        DB::table('cash_movements')->insert([
            'cash_shift_id' => $shiftId,
            'type'          => 'egreso',
            'amount'        => 50000,
            'method'        => 'efectivo',
            'reference'     => 'pago_proveedor',
            'note'          => 'Compra de insumos menores',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        // 5. Cierre del turno (opcional: simular)
        DB::table('cash_shifts')->where('id', $shiftId)->update([
            'closed_by'             => $userId,
            'closing_amount_expected'=> 200000 + DB::table('cash_movements')
                                                    ->where('cash_shift_id', $shiftId)
                                                    ->where('type','ingreso')->sum('amount')
                                                    - DB::table('cash_movements')
                                                    ->where('cash_shift_id', $shiftId)
                                                    ->where('type','egreso')->sum('amount'),
            'closing_amount_real'   => 350000, // ejemplo simulado
            'closed_at'             => Carbon::now(),
            'status'                => 'closed',
            'updated_at'            => now(),
        ]);

        DB::table('cash_movements')->insert([
            'cash_shift_id' => $shiftId,
            'type'          => 'cierre',
            'amount'        => 350000,
            'method'        => 'efectivo',
            'reference'     => 'cierre turno',
            'note'          => 'Cierre de caja del turno',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
    }
}
