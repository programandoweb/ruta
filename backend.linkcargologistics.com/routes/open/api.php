<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Coupons\CouponsController; // Asegúrate de importar el controlador adecuadamente
use App\Http\Controllers\V1\Menu\MenuController; 

Route::get('/dashboard/coupons/new', [CouponsController::class, 'new_generate']);
Route::get('/coupons/{id}', [CouponsController::class, 'openShow']);
Route::post('/coupons/{id}/use', [CouponsController::class, 'use_coupons']);
Route::post('/coupons/search', [CouponsController::class, 'coupons_search']);

Route::get('/open/getInit', [MenuController::class, 'getInit']);


Route::middleware('auth:api')->group(function () {
    Route::get('/dashboard/coupons/{id}', [CouponsController::class, 'show']);
    Route::post('/dashboard/coupons/new', [CouponsController::class, 'store']);
    Route::put('/dashboard/coupons/{id}', [CouponsController::class, 'update']);    
    Route::get('/open/menu', [MenuController::class, 'menu']);    
});

