<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'LeMauvaisCoin API is running2!',
        'status' => 'success',
        'timestamp' => now()->toDateTimeString()
    ]);
});

Route::get('/api', function () {
    return response()->json([
        'message' => 'LeMauvaisCoin API is running12!',
        'status' => 'success',
        'timestamp' => now()->toDateTimeString()
    ]);
});
