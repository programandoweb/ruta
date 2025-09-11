<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Servicios\ServiciosController;

Route::get('services/{slug}/related_items', [ServiciosController::class, 'related_items'])->name('related_items');
Route::get('service/{id}', [ServiciosController::class, 'service'])->name('service');
Route::get('service/{id}/{slug}', [ServiciosController::class, 'service'])->name('service');

Route::middleware('auth:api')->group(function () {
    Route::post('service/{id}/{slug}', [ServiciosController::class, 'schedule'])->name('schedule');
});


