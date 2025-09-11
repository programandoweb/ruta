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
use App\Http\Controllers\V1\Events\EventsController;
use App\Http\Controllers\V1\Events\EventInvitationController;

Route::resource('dashboard/guests', EventInvitationController::class);
Route::resource('dashboard/events', EventsController::class);
Route::post('/dashboard/events/new', [EventsController::class, 'store']);
Route::post('/dashboard/events/{id}/addItem', [EventsController::class, 'addItem']);
Route::post('/dashboard/events/{id}/removeItem', [EventsController::class, 'removeItem']);
Route::post('/dashboard/events/{id}/acceptItem', [EventsController::class, 'acceptItem']);


