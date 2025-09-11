<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::get('/paypal/create-order', [PayPalController::class, 'createOrder']);