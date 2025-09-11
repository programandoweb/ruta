<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCategory;
use App\Models\Services;
use App\Models\Servicios; // asegúrate de tener el modelo correcto
use App\Models\User;
use Illuminate\Support\Str;

class ProfessionalProfileSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Primera visita',
            ],
            [
                'name' => 'Cita para definir modelo',
            ],
            [
                'name' => 'Toma de medidas , aclaraciones de fechas de entrega',
            ],
            [
                'name' => 'Cita para entrega de vestido',
            ],
            [
                'name' => 'Cita para pagos , abonos , facturacion y saldos',
            ],
            [
                'name' => 'Entrega final de tu vestido',
            ],
        ];

        foreach ($services as $serviceData) {
            //$category = ProductCategory::create($serviceData);

            // Crear un servicio por categoría
            Servicios::create([
                'user_id'       => 10,
                'category_id'   => NULL,
                'product_category_id' => NULL,
                'name'          =>  $serviceData["name"],
                'description'   => 'servicio profesional ' . $serviceData["name"],
                'rating'        =>  rand(3, 5),
                'type'          =>  'professional_profile',
                'location'      => '',
                'gallery'       => json_encode(['https://picsum.photos/200']),
            ]);
        }


        $services = [
            ['name' => 'Alitas'],
            ['name' => 'Hamburguesas'],
            ['name' => 'Acompañamientos'],
            ['name' => 'Bebidas'],
        ];

        foreach ($services as $serviceData) {
            ProductCategory::create($serviceData);
        }

        $this->command->info('Categorías de productos creadas correctamente.');
        
    }
}
