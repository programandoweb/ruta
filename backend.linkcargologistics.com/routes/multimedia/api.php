<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Multimedia\MultimediaController;

Route::middleware('auth:api')->group(function () {
    Route::resource('multimedia/upload', MultimediaController::class);  
});

//Route::post('multimedia/upload-open', [MultimediaController::class,"uploadOpen"]); 