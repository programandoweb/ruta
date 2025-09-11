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
use Illuminate\Support\Str;

class BusinessSeeder extends Seeder
{
    public function run()
    {
        $businesses = [
        [
            'name'            => 'Alitas Don Carlos',
            'description'     => 'Especialistas en alitas BBQ, búfalo y sabores únicos artesanales.',
            'price'           => 12000,
            'unit'            => 'unitario',
            'contact_phone'   => '3101112233',
            'contact_email'   => 'ventas@doncarlos.com',
            'whatsapp_link'   => 'https://wa.me/573101112233',
            'location'        => 'Bogotá, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 1,
        ],
        /*
        [
            'name'            => 'Pollos El Campesino',
            'description'     => 'Distribuidor mayorista de pollo fresco, alitas y muslos empacados al vacío.',
            'price'           => 9500,
            'unit'            => 'kg',
            'contact_phone'   => '3204455667',
            'contact_email'   => 'contacto@polloscampesino.com',
            'whatsapp_link'   => 'https://wa.me/573204455667',
            'location'        => 'Medellín, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 2,
        ],
        [
            'name'            => 'Salsas Picantosas',
            'description'     => 'Salsas para alitas en todos los niveles de picante. Gourmet y artesanales.',
            'price'           => 4200,
            'unit'            => 'ml',
            'contact_phone'   => '3019988776',
            'contact_email'   => 'ventas@salsaspicantosas.com',
            'whatsapp_link'   => 'https://wa.me/573019988776',
            'location'        => 'Cali, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 3,
        ],
        [
            'name'            => 'Aceites La Prensa',
            'description'     => 'Aceite vegetal, de palma y girasol para frituras y cocción a gran escala.',
            'price'           => 8900,
            'unit'            => 'l',
            'contact_phone'   => '3123456789',
            'contact_email'   => 'contacto@aceiteslaprensa.com',
            'whatsapp_link'   => 'https://wa.me/573123456789',
            'location'        => 'Barranquilla, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 4,
        ],
        [
            'name'            => 'Sal del Himalaya',
            'description'     => 'Distribuidor de sales gourmet: rosada, marina y ahumada para sazonar alitas.',
            'price'           => 11000,
            'unit'            => 'kg',
            'contact_phone'   => '3136547890',
            'contact_email'   => 'ventas@salhimalaya.com',
            'whatsapp_link'   => 'https://wa.me/573136547890',
            'location'        => 'Manizales, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 5,
        ],
        [
            'name'            => 'Coca-Cola FEMSA',
            'description'     => 'Distribución oficial de bebidas Coca-Cola, Sprite, Fanta y más.',
            'price'           => 3900,
            'unit'            => 'unidad',
            'contact_phone'   => '3001122334',
            'contact_email'   => 'pedidos@coca-cola.com',
            'whatsapp_link'   => 'https://wa.me/573001122334',
            'location'        => 'Bogotá, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 6,
        ],
        [
            'name'            => 'Empaques EcoPack',
            'description'     => 'Empaques biodegradables para alitas, salsas y combos de comida rápida.',
            'price'           => 750,
            'unit'            => 'unidad',
            'contact_phone'   => '3159876543',
            'contact_email'   => 'ventas@ecopack.com',
            'whatsapp_link'   => 'https://wa.me/573159876543',
            'location'        => 'Pereira, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 7,
        ],
        [
            'name'            => 'Salsas & Aderezos La Cosecha',
            'description'     => 'Aderezos tipo ranch, ajo parmesano, tártara y miel mostaza para acompañar alitas.',
            'price'           => 3800,
            'unit'            => 'ml',
            'contact_phone'   => '3167788990',
            'contact_email'   => 'info@lacosecha.com',
            'whatsapp_link'   => 'https://wa.me/573167788990',
            'location'        => 'Bucaramanga, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 8,
        ],
        [
            'name'            => 'Distribuidora Los Pollos',
            'description'     => 'Venta al por mayor de pechugas, muslos, alitas y nuggets empacados.',
            'price'           => 8700,
            'unit'            => 'kg',
            'contact_phone'   => '3190001122',
            'contact_email'   => 'pedidos@lospollos.com',
            'whatsapp_link'   => 'https://wa.me/573190001122',
            'location'        => 'Ibagué, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 9,
        ],
        [
            'name'            => 'Refrescos La Espuma',
            'description'     => 'Bebidas gaseosas y jugos para combos de alitas en presentaciones PET.',
            'price'           => 3100,
            'unit'            => 'unidad',
            'contact_phone'   => '3145566778',
            'contact_email'   => 'ventas@laespuma.com',
            'whatsapp_link'   => 'https://wa.me/573145566778',
            'location'        => 'Neiva, Colombia',
            'allow_comments'  => true,
            'allow_location'  => true,
            'category_id'     => 10,
        ],
        */
    ];


        $role = Role::where('name', 'providers')->where('guard_name', 'api')->first();

        foreach ($businesses as $data) {
            // Crear usuario
            $user = User::firstOrCreate(
                ['email' => Str::slug($data['name'], '_') . '@proveedores.com'],
                [
                    'name'     => $data['name'],
                    'password' => \Hash::make('password'),
                ]
            );

            if ($role) {
                $user->assignRole($role);
            }

            // Insertar negocio
            $businessId = DB::table('businesses')->insertGetId([
                'user_id'         => $user->id,
                'name'            => $data['name'],
                'description'     => $data['description'],
                'price'           => $data['price'],
                'is_active'       => true,
                'contact_phone'   => $data['contact_phone'],
                'contact_email'   => $data['contact_email'],
                'whatsapp_link'   => $data['whatsapp_link'],
                'location'        => $data['location'],
                'allow_comments'  => $data['allow_comments'],
                'allow_location'  => $data['allow_location'],
                'category_id'     => $data['category_id'],
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
            
        }
    }
}
