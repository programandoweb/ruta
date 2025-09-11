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
use App\Models\Events;
use App\Models\EventItems;
use App\Models\Business;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Carbon;

class EventsSeeder extends Seeder
{
    public function run()
    {
        // Obtener el rol "clients" bajo el guard "api"
        $roleApi = Role::where('name', 'clients')->where('guard_name', 'api')->first();

        if (!$roleApi) {
            $this->command->warn('Rol "clients" con guard "api" no encontrado.');
            return;
        }

        // Obtener todos los usuarios que tienen el rol "clients" bajo el guard "api"
        $clients = User::whereHas('roles', function ($q) use ($roleApi) {
            $q->where('role_id', $roleApi->id);
        })->get();

        // Obtener todos los negocios disponibles
        $businesses = Business::all();

        if ($clients->isEmpty() || $businesses->isEmpty()) {
            $this->command->warn('No hay usuarios con rol clients o negocios disponibles.');
            return;
        }

        foreach ($clients as $client) {
            // Crear un evento de prueba para el cliente
            $event = Events::create([
                'user_id'    => $client->id,
                'title'      => 'Evento de ' . $client->name,
                'event_date' => Carbon::now()->addDays(rand(10, 60)),
                'budget'     => rand(1000, 10000),
                'guests'     => rand(20, 100),
                'notes'      => 'Este es un evento de prueba generado por seeder.',
            ]);

            // Seleccionar aleatoriamente hasta 4 negocios para asociar como ítems del evento
            $selectedBusinesses = $businesses->random(min(4, $businesses->count()));

            foreach ($selectedBusinesses as $business) {
                EventItems::create([
                    'event_id'    => $event->id,
                    'business_id' => $business->id,
                    'quantity'    => rand(1, 10),
                    'notes'       => 'Ítem de prueba para evento de ' . $client->name,
                ]);
            }
        }

        $this->command->info('Eventos y sus ítems creados para todos los usuarios con rol clients (guard api).');
    }
}
