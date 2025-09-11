<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Events\EventTasksController;

Route::resource('/dashboard/tasks', EventTasksController::class);
Route::post('/dashboard/tasks/new', [EventTasksController::class,"store"]);
