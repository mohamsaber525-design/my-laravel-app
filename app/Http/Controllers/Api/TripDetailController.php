<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TripDetail;
use Illuminate\Http\Request;

class TripDetailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'day_number' => 'required|integer',
            'title' => 'required|string',
        ]);

        return TripDetail::create($validated);
    }
}
