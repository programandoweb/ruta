<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\ImagesRoute;


Route::middleware([ImagesRoute::class])->group(function () {
    Route::prefix('v1')->group(function () {        
       
        require __DIR__ . '/open/api.php';  
        require __DIR__ . '/dataset/api.php';  
        require __DIR__ . '/auth/api.php';  
        require __DIR__ . '/multimedia/api.php'; 
        require __DIR__ . '/services/open.php';
        
        Route::middleware('auth:api')->group(function () {
            require __DIR__ . '/paypal/api.php';    
            require __DIR__ . '/services/api.php';    
            require __DIR__ . '/me/api.php';  
            require __DIR__ . '/account/api.php';  
            require __DIR__ . '/orders/api.php';  
            require __DIR__ . '/coupons/api.php';  
            require __DIR__ . '/providers/api.php';  
            require __DIR__ . '/events/api.php';  
            require __DIR__ . '/notifications/api.php';  
            require __DIR__ . '/calendar/api.php';              
            require __DIR__ . '/summary/api.php';              
            require __DIR__ . '/tasks/api.php';
            require __DIR__ . '/inventory/api.php';
            require __DIR__ . '/reports/api.php';
            require __DIR__ . '/cash/api.php';
            require __DIR__ . '/routes/api.php';
        });
        
    });
});



