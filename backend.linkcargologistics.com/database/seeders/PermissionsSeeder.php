<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Sistema de Rutas
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

            // Rutas
            'create_routes',
            'read_routes',
            'update_routes',
            'delete_routes',
            'manage_routes',

            // Seguimiento
            'create_tracking',
            'read_tracking',
            'update_tracking',
            'delete_tracking',
            'manage_tracking',

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

                    'create_routes', 'read_routes', 'update_routes', 'delete_routes', 'manage_routes',
                    'create_tracking', 'read_tracking', 'update_tracking', 'delete_tracking', 'manage_tracking',

                    'read_settings', 'update_settings',

                    'dev_access',
                ]);
            } elseif ($roleName === 'managers') {
                $role->syncPermissions([
                    'read_routes', 'create_routes', 'update_routes',
                    'read_tracking', 'update_tracking',

                    'read_settings',
                ]);
            } elseif ($roleName === 'employees') {
                $role->syncPermissions([
                    'read_routes',
                    'read_tracking', 'update_tracking',
                ]);
            } elseif ($roleName === 'clients') {
                $role->syncPermissions([
                    'read_routes',
                    'read_tracking',
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
