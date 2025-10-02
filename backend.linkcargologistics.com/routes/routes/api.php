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
use App\Http\Controllers\V1\Routes\RoutesController;
use App\Http\Controllers\V1\Routes\RouteItemsController;

// 🔹 Reportes (ejemplo existente)
Route::get('/dashboard/reports/inventory-status', [RoutesController::class, 'inventory_status']);

// 🔹 CRUD de rutas
Route::prefix('dashboard/routes')->group(function () {
    Route::get('/', [RoutesController::class, 'index']);
    Route::post('/new', [RoutesController::class, 'store']);
    Route::get('/{id}', [RoutesController::class, 'show']);
    Route::put('/{id}', [RoutesController::class, 'update']);
    Route::delete('/{id}', [RoutesController::class, 'destroy']);

    // 👇 rutas específicas sobre una ruta existente
    Route::post('/{id}/set-status-address', [RoutesController::class, 'setStatusAddress']);
    Route::put('/{id}/reorder', [RoutesController::class, 'reorder']); // ✅ nueva
});


Route::prefix('dashboard/tracking')->group(function () {
    Route::get('/', [RoutesController::class, 'index']);
    Route::post('/new', [RoutesController::class, 'store']);
    Route::get('/{id}', [RoutesController::class, 'show']);
    Route::put('/{id}', [RoutesController::class, 'update']);
    Route::delete('/{id}', [RoutesController::class, 'destroy']);
    // 👇 RUTA NUEVA AÑADIDA AQUÍ
    // Ruta para una acción específica sobre una ruta existente.
    Route::post('/{id}/set-status-address', [RoutesController::class, 'setStatusAddress']);
});


Route::prefix('routes')->group(function () {
    // 🔹 Importar items de ruta vía Excel
    Route::post('/import-excel', [RouteItemsController::class, 'importExcel']);
    // 🔹 CRUD de items dentro de una ruta
    Route::get('/{route_id}/items', [RouteItemsController::class, 'index']);
    Route::post('/{route_id}/items', [RouteItemsController::class, 'store']);
    Route::get('/{route_id}/items/{id}', [RouteItemsController::class, 'show']);
    Route::put('/{route_id}/items/{id}', [RouteItemsController::class, 'update']);
    Route::delete('/{route_id}/items/{id}', [RouteItemsController::class, 'destroy']);
});