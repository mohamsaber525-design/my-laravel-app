<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function dashboard()
    {
        $totalTrips = Trip::count();
        $totalUsers = User::where('role', '!=', 'admin')->count();
        $totalReservations = Reservation::count();
        
        // Calcul du revenu total (uniquement les réservations confirmées ou payées)
        // Supposons que 'confirmed' est le statut pour les revenus comptabilisés
        $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_amount');

        return response()->json([
            'total_trips' => $totalTrips,
            'total_users' => $totalUsers,
            'total_reservations' => $totalReservations,
            'total_revenue' => $totalRevenue
        ]);
    }
}
