<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //$this->call(UnifiedLocationsSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(MasterTableSeeder::class);
        $this->call(PermissionsSeeder::class);        
        $this->call(ServicesTableSeeder::class); 
        $this->call(BusinessSeeder::class); 
        $this->call(EventsSeeder::class); 
        $this->call(OrdersSeeder::class); 
        //$this->call(ProductsSeeder::class); 
        $this->call(ProfessionalProfileSeeder::class); 
        $this->call(CalendarAvailabilitiesSeeder::class); 
        //$this->call(InventoryItemsSeeder::class); 
        $this->call(BarInventoryItemsSeeder::class); 
        $this->call(AreasSeeder::class); 
        //$this->call(ProductsStockSeeder::class); 
        //$this->call(InventoryMovementsSeeder::class); 
        //$this->call(CashSeeder::class); 
    }
}
