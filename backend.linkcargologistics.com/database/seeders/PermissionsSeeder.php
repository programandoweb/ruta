<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Str;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        set_time_limit(600);

        $permissions = [
            'home_index',

            // Inventario
            'create_inventory',
            'read_inventory',
            'update_inventory',
            'delete_inventory',

            // Insumos
            'create_raw_materials',
            'read_raw_materials',
            'update_raw_materials',
            'delete_raw_materials',

            // Entradas y salidas
            'create_entries',
            'read_entries',
            'create_exits',
            'read_exits',
            'adjust_stock',

            // Recetas
            'create_recipes',
            'read_recipes',
            'update_recipes',
            'delete_recipes',

            // Ventas
            'create_sales',
            'read_sales',
            'update_sales',
            'delete_sales',

            // Reportes
            'read_reports',

            // Proveedores
            'create_providers',
            'read_providers',
            'update_providers',
            'delete_providers',

            // Configuración
            'read_settings',
            'update_settings',

            // Gestión de empresas (solo super-admin)
            'create_companies',
            'read_companies',
            'update_companies',
            'delete_companies',
            'manage_companies',
            'manage_company_admins',

            // Módulo Desarrollador
            'dev_access',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'api']);
        }

        $roles = Role::all()->pluck('name');

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);

            if ($roleName === 'super-admin') {
                $role->syncPermissions(Permission::where('guard_name', 'api')->get());
            } elseif ($roleName === 'admin') {
                $role->syncPermissions([
                    'home_index',

                    'create_inventory', 'read_inventory', 'update_inventory', 'delete_inventory',
                    'create_raw_materials', 'read_raw_materials', 'update_raw_materials', 'delete_raw_materials',
                    'create_entries', 'read_entries',
                    'create_exits', 'read_exits',
                    'adjust_stock',

                    'create_recipes', 'read_recipes', 'update_recipes', 'delete_recipes',

                    'create_sales', 'read_sales', 'update_sales', 'delete_sales',

                    'read_reports',

                    'create_providers', 'read_providers', 'update_providers', 'delete_providers',

                    'read_settings', 'update_settings',

                    'dev_access',
                ]);
            } elseif ($roleName === 'managers') {
                $role->syncPermissions([
                    'create_inventory', 'read_inventory', 'update_inventory',
                    'create_raw_materials', 'read_raw_materials', 'update_raw_materials',
                    'create_entries', 'read_entries',
                    'create_exits', 'read_exits',
                    'adjust_stock',

                    'create_recipes', 'read_recipes', 'update_recipes',

                    'create_sales', 'read_sales',

                    'read_reports',

                    'read_providers',

                    'read_settings', 'update_settings',
                ]);
            } elseif ($roleName === 'employees') {
                $role->syncPermissions([
                    'read_inventory',
                    'read_raw_materials',
                    'create_exits', 'read_exits',
                    'read_recipes',
                    'create_sales', 'read_sales',
                ]);
            } elseif ($roleName === 'providers') {
                $role->syncPermissions([
                    'read_raw_materials',
                    'read_inventory',
                    'read_entries',
                    'read_exits',
                    'read_reports',
                    'read_providers',
                    'read_settings',
                ]);
            } elseif ($roleName === 'clients') {
                $role->syncPermissions([
                    'read_inventory',
                    'read_raw_materials',
                    'read_sales',
                ]);
            }
        }

        // Crear usuarios por rol
        foreach ($roles as $roleName) {
            $user = User::firstOrCreate([
                'name' => $roleName . ' Jorge Méndez',
                'email' => Str::slug($roleName) . '@programandoweb.net',
                'password' => \Hash::make('password'),
            ]);

            $roleInstance = Role::where('name', $roleName)->where('guard_name', 'api')->first();
            if ($roleInstance) {
                $user->assignRole($roleInstance);
            }
        }
    }
}
