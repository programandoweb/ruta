<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run()
    {        
        Role::create(['name' => 'super-admin', 'guard_name' => 'api']);
        Role::create(['name' => 'admin' , 'guard_name' => 'api']);
        Role::create(['name' => 'clients' , 'guard_name' => 'api']);
        Role::create(['name' => 'providers' , 'guard_name' => 'api']);
        Role::create(['name' => 'employees' , 'guard_name' => 'api']);        
        Role::create(['name' => 'managers' , 'guard_name' => 'api']);
    }
}
