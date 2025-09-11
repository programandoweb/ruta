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

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Reports\ReportsController;


Route::get('/dashboard/reports/inventory-status', [ReportsController::class, 'inventory_status']);
Route::get('/dashboard/reports/inventory-movements', [ReportsController::class, 'inventory_movements']);
Route::get('/dashboard/reports/kardex', [ReportsController::class, 'kardex']);
Route::get('/dashboard/reports/provider-purchases', [ReportsController::class, 'providerPurchases']);
Route::get('/dashboard/reports/ganance-purchases', [ReportsController::class, 'ganancePurchases']);






