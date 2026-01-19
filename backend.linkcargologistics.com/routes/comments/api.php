<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Comments\CommentsController; // Asegúrate de importar el controlador adecuadamente


Route::prefix('dashboard')->group(function () {    
    Route::get('comments/{model}', [CommentsController::class,"getBymodel"]);    
    Route::post('comments/{model}', [CommentsController::class,"setBymodel"]);  
      
});
Route::resource('dashboard/comments', CommentsController::class)->names([
    'index'   => 'comments.index',
    'store'   => 'comments.store',
    'show'    => 'comments.show',
    'update'  => 'comments.update',
    'destroy' => 'comments.destroy',
]);