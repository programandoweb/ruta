<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Services;
use App\Models\Servicios; // asegúrate de tener el modelo correcto
use App\Models\User;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class ServicesTableSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name'        => 'Lugar y Ambientación',
                'pathname'    => Str::slug('Lugar y Ambientación'),
                'description' => 'Salón o espacio adecuado para la cantidad de invitados, iluminación, decoración y ambientación temáticas.',
                'image'       => 'images/default/services/ambientacion.jpg',
                'cover'       => 'images/default/services/ambientacion.jpg',
            ],
            [
                'name'        => 'Catering y Bebidas',
                'pathname'    => Str::slug('Catering y Bebidas'),
                'description' => 'Servicio de alimentos y bebidas para la cena o comida, menús personalizados y postres.',
                'image'       => 'images/default/services/catering.jpg',
                'cover'       => 'images/default/services/catering.jpg',
            ],
            [
                'name'        => 'Música y Entretenimiento',
                'pathname'    => Str::slug('Música y Entretenimiento'),
                'description' => 'Contratación de DJ, banda o grupo musical, show en vivo, coreografías y animadores.',
                'image'       => 'images/default/services/entretenimiento.jpg',
                'cover'       => 'images/default/services/entretenimiento.jpg',
            ],
            [
                'name'        => 'Decoración y Arreglos Florales',
                'pathname'    => Str::slug('Decoración y Arreglos Florales'),
                'description' => 'Diseño de mesas, centros de mesa, adornos florales y detalles temáticos.',
                'image'       => 'images/default/services/decoracion.jpg',
                'cover'       => 'images/default/services/decoracion.jpg',
            ],
            [
                'name'        => 'Fotografía y Video',
                'pathname'    => Str::slug('Fotografía y Video'),
                'description' => 'Sesiones fotográficas, cobertura del evento y video de alta calidad.',
                'image'       => 'images/default/services/fotografia.jpg',
                'cover'       => 'images/default/services/fotografia.jpg',
            ],
            [
                'name'        => 'Invitaciones y Recuerdos',
                'pathname'    => Str::slug('Invitaciones y Recuerdos'),
                'description' => 'Diseño de invitaciones, recuerdos para los invitados y detalles personalizados.',
                'image'       => 'images/default/services/invitaciones.jpg',
                'cover'       => 'images/default/services/invitaciones.jpg',
            ],
            [
                'name'        => 'Coordinación y Logística',
                'pathname'    => Str::slug('Coordinación y Logística'),
                'description' => 'Planificación, organización del evento y supervisión de proveedores.',
                'image'       => 'images/default/services/logistica.jpg',
                'cover'       => 'images/default/services/logistica.jpg',
            ],
            [
                'name'        => 'Transporte',
                'pathname'    => Str::slug('Transporte'),
                'description' => 'Vehículos para trasladar invitados o festejada, limusinas, autobuses y más.',
                'image'       => 'images/default/services/transporte.jpg',
                'cover'       => 'images/default/services/transporte.jpg',
            ],
            [
                'name'        => 'Iluminación',
                'pathname'    => Str::slug('Iluminación'),
                'description' => 'Luces decorativas, efectos especiales y ambientación lumínica.',
                'image'       => 'images/default/services/iluminacion.jpg',
                'cover'       => 'images/default/services/iluminacion.jpg',
            ],
            [
                'name'        => 'Vestimenta',
                'pathname'    => Str::slug('Vestimenta'),
                'description' => 'Traje o vestido, accesorios y arreglos para la festejada y corte de honor.',
                'image'       => 'images/default/services/vestimenta.jpg',
                'cover'       => 'images/default/services/vestimenta.jpg',
            ],
        ];
        
        
        
        // Busca un usuario cualquiera (o crea uno por defecto)
        $user = User::factory()->create([
            'name' => 'Jorge Méndez',
            'email' => 'lic.jorgemendez@gmail.com',
            'password' => bcrypt('12345678'),
        ]);

        $user_2 =   $user = User::factory()->create([
            'name'              => 'Salón de Eventos La Estancia',
            'email'             => Str::slug('Salón de Eventos La Estancia', '_').'@proveedores.com',
            'password' => bcrypt('password'),
        ],);

        $role = Role::where('name', 'providers')->where('guard_name', 'api')->first();

        if ($role) {
            $user->assignRole($role);
        }

        $user = User::factory()->create([
            'customer_group_id' =>  $user_2->id,
            'company_name'      =>  $user_2->name,
            'name'              =>  'Manager La Estancia',
            'email'             =>  Str::slug('Manager La Estancia', '_').'@proveedores.com',
            'password'          =>  bcrypt('password'),
        ],);

        $role       =   Role::where('name', 'managers')->where('guard_name', 'api')->first();

        if ($role) {
            $user->assignRole($role);
        }



        $user = User::factory()->create([
            'customer_group_id' =>  $user_2->id,
            'company_name'      =>  $user_2->name,
            'name'              =>  'Empleado La Estancia',
            'email'             =>  Str::slug('Empleado La Estancia', '_').'@proveedores.com',
            'password'          =>  bcrypt('password'),
        ],);

        $role       =   Role::where('name', 'employees')->where('guard_name', 'api')->first();

        if ($role) {
            $user->assignRole($role);
        }
            

        foreach ($services as $serviceData) {
            $category = Services::create($serviceData);

            // Crear un servicio por categoría
            Servicios::create([
                'user_id'     => 10,
                'category_id' => $category->id,
                'name'        => 'Ejemplo de ' . $category->name,
                'description' => $category->description,
                'rating'      => rand(3, 5),
                'location'    => 'Ciudad de Ejemplo',
                'gallery'     => json_encode(['https://picsum.photos/200']),
            ]);
        }
    }
}
