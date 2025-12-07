<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        // Retourne tous les utilisateurs avec le nombre de réservations
        return User::withCount('reservations')->get();
    }
}
