<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Cash\CashController;

Route::prefix('dashboard/cash')->group(function () {
    Route::post('/open',     [CashController::class, 'open']);
    Route::get('/status',    [CashController::class, 'status']);
    Route::get('/summary',   [CashController::class, 'summary']);
    Route::get('/movements', [CashController::class, 'movements']);
    Route::post('/income',   [CashController::class, 'income']);
    Route::post('/expense',  [CashController::class, 'expense']);
    Route::post('/safe-drop',[CashController::class, 'safeDrop']);
    Route::post('/close',    [CashController::class, 'close']);
    Route::get('/report-z',  [CashController::class, 'reportZ']);
});