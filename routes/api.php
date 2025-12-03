<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\TripDetailController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AdminReservationController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/trips', [TripController::class, 'index']);
Route::get('/trips/{id}', [TripController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Reservations (Client)
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/me', [ReservationController::class, 'index']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Payments
    Route::post('/payments', [PaymentController::class, 'store']);

    // Trip Details (admin usage aussi)
    Route::post('/trip-details', [TripDetailController::class, 'store']);
});



Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // Admin — listing des réservations
    Route::get('/admin/reservations', [AdminReservationController::class, 'index']);

    // Admin — changer le statut
    Route::put('/admin/reservations/{id}', [AdminReservationController::class, 'updateStatus']);

    // Admin — CRUD Trips
    Route::post('/admin/trips', [TripController::class, 'store']);
    Route::put('/admin/trips/{id}', [TripController::class, 'update']);
    Route::delete('/admin/trips/{id}', [TripController::class, 'destroy']);
});