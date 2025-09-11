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
use App\Http\Controllers\V1\Calendar\CalendarAvailabilitiesController;
use App\Http\Controllers\V1\Events\EventOrdersController;

Route::resource('dashboard/calendar_availabilities', CalendarAvailabilitiesController::class);
Route::put('/dashboard/calendar_slots/{id}/update_attention', [CalendarAvailabilitiesController::class, 'updateAttention']);
Route::get('/dashboard/calendar_slots/{id}', [CalendarAvailabilitiesController::class, 'calendar_slots_by_id']);
Route::get('/dashboard/calendar_slots', [CalendarAvailabilitiesController::class, 'calendar_slots']);
Route::post('/dashboard/calendar_slots/asignar', [CalendarAvailabilitiesController::class, 'assignEmployeeToSlot']);
Route::put('/dashboard/calendar_slots/asignar/{id}', [CalendarAvailabilitiesController::class, 'reAssignEmployeeToSlot']);
Route::post('/dashboard/calendar_slots/asignar_desde_cliente', [CalendarAvailabilitiesController::class, 'assignEmployeeToSlotClient']);


Route::post('/dashboard/attention/add_product', [EventOrdersController::class, 'add_product']);
Route::delete('/dashboard/attention/delete_product/{id}', [EventOrdersController::class, 'delete_product']);
