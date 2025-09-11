<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Cash\CashServiceInterface;
use App\Services\Cash\CashService;
use App\Services\Inventory\InventoryConsumptionServiceInterface;
use App\Services\Inventory\InventoryConsumptionService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CashServiceInterface::class, CashService::class);
        $this->app->bind(InventoryConsumptionServiceInterface::class, InventoryConsumptionService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
