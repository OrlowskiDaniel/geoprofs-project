<?php

use App\Http\Controllers\HelloController;
use Illuminate\Support\Facades\Route;

// Every route here is automatically prefixed with /api
// (that prefix is set in bootstrap/app.php / RouteServiceProvider).

Route::get('/hello', [HelloController::class, 'show']);

// This is the shape every future endpoint will follow, e.g.:
// Route::get('/leave/requests', [LeaveRequestController::class, 'index']);
// Route::post('/leave/requests', [LeaveRequestController::class, 'store']);
