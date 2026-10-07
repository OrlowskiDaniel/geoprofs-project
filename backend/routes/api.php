<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\ManagerLeaveRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/leave-types', [LeaveTypeController::class, 'index']);

    Route::get('/manager/leave-requests', [ManagerLeaveRequestController::class, 'index']);
  
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::get('/leave-requests/{id}', [LeaveRequestController::class, 'show']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
    Route::delete('/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
});

Route::post('/login', [AuthController::class, 'login']);
  
Route::middleware('auth:sanctum')->post(
    '/logout',
    [AuthController::class, 'logout']
);

Route::middleware('auth:sanctum')->post(
    '/change-password',
    [AuthController::class, 'changePassword']
);
