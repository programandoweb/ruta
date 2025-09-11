<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Coupons\CouponsController; // Asegúrate de importar el controlador adecuadamente

Route::get('/dashboard/coupons', [CouponsController::class, 'index']);
