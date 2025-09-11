<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Orders\OrdersController; // Asegúrate de importar el controlador adecuadamente
use App\Http\Controllers\V1\Events\EventOrdersController; // Asegúrate de importar el controlador adecuadamente

Route::get('/dashboard/orders', [OrdersController::class, 'index']);

Route::resource('dashboard/event_orders', EventOrdersController::class);


Route::put('/dashboard/event_orders/order/{id}/status', [EventOrdersController::class, 'status']);


Route::post('/dashboard/order/add', [OrdersController::class, 'add_item']);
Route::get('/dashboard/order/{id}', [OrdersController::class, 'showByTable']);
Route::delete('/dashboard/order/remove/{id}', [OrdersController::class, 'remove_item']);

Route::post('/dashboard/order/print-group', [OrdersController::class, 'print_group']);
Route::post('/dashboard/order/print-all', [OrdersController::class, 'print_all']);

Route::post('/dashboard/order/pay-group', [OrdersController::class, 'pay_group']);

Route::post('/dashboard/order/close', [OrdersController::class, 'close']);

Route::post('/dashboard/order/pay-all', [OrdersController::class, 'pay_all']);

Route::post('/dashboard/order/register-payment', [OrdersController::class, 'register_payment']);


Route::get('/dashboard/sales', [OrdersController::class, 'sales']);
Route::get('/dashboard/sales/{id}', [OrdersController::class, 'sales_by_id']);