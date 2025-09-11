<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Notification\NotificationController; // Asegúrate de importar el controlador adecuadamente

Route::middleware('auth:api')->group(function () {
    Route::resource('/dashboard/notifications', NotificationController::class);
});

