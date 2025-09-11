<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Servicios\ServiciosController;
use App\Http\Controllers\V1\Products\ProductsController;
use App\Http\Controllers\V1\Products\ProductsItemsController;
use App\Http\Controllers\V1\Products\CategoriesController;

// Ruta resource para el controlador de servicios
Route::resource('dashboard/products', ProductsController::class);
Route::post('dashboard/products/new', [ProductsController::class,"store"]);

Route::post('dashboard/fastCreateProduct', [ProductsController::class,"fastCreateProduct"]);

Route::resource('dashboard/recipes', ProductsController::class);
Route::post('dashboard/recipes/new', [ProductsController::class,"store"]);

Route::post('/dashboard/recipes/{productId}/add_product', [ProductsItemsController::class, 'store']);
Route::delete('/dashboard/recipes/delete_product/{id}', [ProductsItemsController::class, 'destroy']);

Route::resource('dashboard/professional_profile', ServiciosController::class);
Route::post('dashboard/professional_profile/new', [ServiciosController::class,"store"]);

Route::resource('dashboard/services', ServiciosController::class);
Route::post('dashboard/services/new', [ServiciosController::class,"store"]);

Route::resource('dashboard/categories', CategoriesController::class);
Route::post('dashboard/categories/new', [CategoriesController::class,"store"]);
