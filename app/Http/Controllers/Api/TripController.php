<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function index()
    {
        return Trip::with(['category', 'details'])->get();
    }

    public function show($id)
    {
        return Trip::with(['category', 'details', 'reviews'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string',
            'slug' => 'required|string|unique:trips,slug',
            'location' => 'required|string',
            'price' => 'required|numeric',
            'duration_days' => 'required|integer',
        ]);

        $trip = Trip::create($validated);
        return response()->json($trip, 201);
    }

    public function update(Request $request, $id)
    {
        $trip = Trip::findOrFail($id);

        $trip->update($request->all());
        return $trip;
    }

    public function destroy($id)
    {
        Trip::destroy($id);
        return ['message' => 'Trip deleted'];
    }
}
