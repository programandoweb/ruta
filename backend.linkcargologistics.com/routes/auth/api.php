<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Auth\AuthController; // Asegúrate de importar el controlador adecuadamente


Route::prefix('auth')->group(function () {    
    Route::get('/login', [AuthController::class, 'init'])->name('init');

    Route::post('confirm', [AuthController::class, 'verifyCode'])->name('verifyCode');
    Route::get('register', [AuthController::class, 'init'])->name('init');
    Route::post('/', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login');    
    Route::post('/register', [AuthController::class, 'register'])->name('register');    
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api')->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api')->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->middleware('auth:api')->name('me');    
});