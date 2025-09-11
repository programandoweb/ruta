<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Business;

class OrdersSeeder extends Seeder
{
    public function run()
    {
        return;
        $businesses = Business::all();

        if ($businesses->count() < 3) {
            return; // Abort si no hay suficientes negocios para relacionar
        }

        DB::table('orders')->insert([
            [
                'user_id'        => 7,
                'business_id'    => $businesses[0]->id,
                'status'         => 'pendiente',
                'scheduled_at'   => Carbon::now()->addDays(1),
                'total_price'    => 120000,
                'payment_method' => 'efectivo',
                'notes'          => 'Servicio urgente',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => 7,
                'business_id'    => $businesses[1]->id,
                'status'         => 'procesando',
                'scheduled_at'   => Carbon::now()->addDays(2),
                'total_price'    => 95000,
                'payment_method' => 'tarjeta',
                'notes'          => null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => 7,
                'business_id'    => $businesses[2]->id,
                'status'         => 'completada',
                'scheduled_at'   => Carbon::now()->subDay(),
                'total_price'    => 185000,
                'payment_method' => 'nequi',
                'notes'          => 'Cliente frecuente',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => 7,
                'business_id'    => $businesses[0]->id,
                'status'         => 'cancelada',
                'scheduled_at'   => Carbon::now()->addDays(3),
                'total_price'    => 0,
                'payment_method' => 'pse',
                'notes'          => 'Cancelado por cliente',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => 7,
                'business_id'    => $businesses[1]->id,
                'status'         => 'pendiente',
                'scheduled_at'   => Carbon::now()->addHours(5),
                'total_price'    => 75000,
                'payment_method' => 'efectivo',
                'notes'          => null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
