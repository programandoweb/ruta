<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\PayPal\PayPalController; // Asegúrate de importar el controlador adecuadamente

Route::post('/paypal/create-order', [PayPalController::class, 'createOrder']);
Route::post('/paypal/capture-order', [PayPalController::class, 'captureOrder']);
