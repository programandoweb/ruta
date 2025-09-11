<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Inventory\RawMaterialsController; 
use App\Http\Controllers\V1\Inventory\CategoriesController; 
use App\Http\Controllers\V1\Inventory\MovementsController; 

Route::resource('dashboard/inventory/raw-materials', RawMaterialsController::class);
Route::post('dashboard/inventory/raw-materials/new', [RawMaterialsController::class,"store"]);


Route::resource('dashboard/inventory/categories', CategoriesController::class);
Route::post('dashboard/inventory/categories/new', [CategoriesController::class,"store"]);

/*
Route::resource('dashboard/inventory/entries', MovementsController::class);
Route::post('dashboard/inventory/entries/new', [MovementsController::class,"store"]);
*/

Route::prefix('dashboard/inventory/entries')->group(function () {
    Route::get('/', [MovementsController::class, 'index']);
    Route::post('/new', [MovementsController::class, 'store']);
    Route::get('/{id}', [MovementsController::class, 'show']);
    Route::delete('/{id}', [MovementsController::class, 'destroy']);
});

Route::prefix('dashboard/inventory/exits')->group(function () {
    Route::get('/', [MovementsController::class, 'index']);
    Route::post('/new', [MovementsController::class, 'store']);
    Route::get('/{id}', [MovementsController::class, 'show']);
    Route::delete('/{id}', [MovementsController::class, 'destroy']);
});


Route::prefix('dashboard/inventory/adjustments')->group(function () {
    Route::get('/', [MovementsController::class, 'index']);
    Route::post('/new', [MovementsController::class, 'store']);
    Route::get('/{id}', [MovementsController::class, 'show']);
    Route::delete('/{id}', [MovementsController::class, 'destroy']);
});

