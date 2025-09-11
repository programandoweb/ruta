<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Summary\SummaryController;


Route::get('/dashboard/summary', [SummaryController::class, 'summary']);