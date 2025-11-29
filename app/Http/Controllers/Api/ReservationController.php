<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return Reservation::with(['trip','user','payment'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'guest_name' => 'required|string',
            'guest_email' => 'required|email',
            'people_count' => 'required|integer|min=1',
            'date_reservation' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        return Reservation::create($validated);
    }

    public function updateStatus(Request $request, $id)
    {
        $res = Reservation::findOrFail($id);
        $res->status = $request->status;
        $res->save();

        return $res;
    }
}
