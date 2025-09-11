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
use App\Models\User;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

class CalendarAvailabilitiesSeeder extends Seeder
{
    public function run(): void
    {
        $providerRole = Role::where('name', 'providers')->where('guard_name', 'api')->first();
        $employeeRole = Role::where('name', 'employees')->where('guard_name', 'api')->first();

        $users = User::whereHas('roles', function ($query) use ($providerRole, $employeeRole) {
            $query->whereIn('role_id', [$providerRole?->id, $employeeRole?->id]);
        })->get();

        foreach ($users as $user) {
            foreach (range(1, 5) as $weekday) { // Lunes (1) a Viernes (5)

                // Slots 8:00 - 12:00
                $this->generateHourlySlots($user->id, $weekday, '08:00', '12:00');

                // Slots 13:00 - 18:00
                $this->generateHourlySlots($user->id, $weekday, '13:00', '18:00');
            }
        }
    }

    private function generateHourlySlots(int $providerId, int $weekday, string $start, string $end): void
    {
        $startTime = Carbon::createFromTimeString($start);
        $endTime = Carbon::createFromTimeString($end);

        while ($startTime < $endTime) {
            $slotStart = $startTime->copy();
            $slotEnd = $startTime->copy()->addHour();

            DB::table('calendar_availabilities')->insert([
                'provider_id' => $providerId,
                'weekday'     => $weekday,
                'start_time'  => $slotStart->format('H:i:s'),
                'end_time'    => $slotEnd->format('H:i:s'),
                'status'      => 'activo',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            $startTime->addHour();
        }
    }
}
