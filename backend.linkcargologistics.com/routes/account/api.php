<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Users\UserAccountController; 
use App\Http\Controllers\V1\Users\UsersController; 
use App\Http\Controllers\V1\Users\EmployeesController;
use App\Http\Controllers\V1\Business\BusinessController;


Route::get('/dashboard/account', [UserAccountController::class, 'account_show']);

Route::get('/dashboard/account/basic', [UserAccountController::class, 'show']);
Route::post('/dashboard/account/basic', [UserAccountController::class, 'update']);
Route::put('/dashboard/account/basic', [UserAccountController::class, 'update']);

Route::get('/dashboard/my-business', [UserAccountController::class, 'business']);
Route::post('/dashboard/my-business', [UserAccountController::class, 'update_business']);

Route::resource('dashboard/employees', EmployeesController::class);
Route::post('dashboard/employees/new', [EmployeesController::class,"store"]);



Route::resource('dashboard/companies', BusinessController::class);
Route::post('dashboard/companies/new', [BusinessController::class,"store"]);


Route::resource('dashboard/users', UsersController::class);
Route::post('dashboard/users/new', [UsersController::class,"store"]);
