<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\ManagerLeaveRequestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PlanningController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/me', [UserController::class, 'me']);
    Route::get('/profile/{id}', [UserController::class, 'show']);

    Route::get('/leave-types', [LeaveTypeController::class, 'index']);

    Route::get('/manager/leave-requests', [ManagerLeaveRequestController::class, 'index']);
    Route::get('/manager/notifications', [NotificationController::class, 'managerNotifications']);
    Route::get('/manager/planning', [PlanningController::class, 'index']);

    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::get('/leave-requests/{id}', [LeaveRequestController::class, 'show']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
    Route::delete('/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/manager/notifications', [NotificationController::class, 'managerNotifications']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});
