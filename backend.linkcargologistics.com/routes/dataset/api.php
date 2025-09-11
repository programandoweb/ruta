<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Servicios\ServiciosController;
Route::get('/dataset/get', [ServiciosController::class, 'get']);