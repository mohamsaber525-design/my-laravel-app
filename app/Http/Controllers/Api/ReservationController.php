<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        // Retourner uniquement les réservations de l'utilisateur connecté
        return auth()->user()->reservations()->with(['trip', 'payment'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:20',
            'people_count' => 'required|integer|min:1',
            'date_reservation' => 'required|date|after_or_equal:today',
        ]);

        // Récupérer le voyage pour calculer le montant total
        $trip = \App\Models\Trip::findOrFail($validated['trip_id']);

        // Calculer le montant total
        $totalAmount = $trip->price * $validated['people_count'];

        // Créer la réservation
        $reservation = Reservation::create([
            'trip_id' => $validated['trip_id'],
            'user_id' => auth()->id(),
            'guest_name' => $validated['guest_name'],
            'guest_email' => $validated['guest_email'],
            'guest_phone' => $validated['guest_phone'] ?? null,
            'people_count' => $validated['people_count'],
            'date_reservation' => $validated['date_reservation'],
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation->load('trip')
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->status = $validated['status'];
        $reservation->save();

        return response()->json([
            'message' => 'Reservation status updated successfully',
            'reservation' => $reservation->load('trip')
        ]);
    }
}
