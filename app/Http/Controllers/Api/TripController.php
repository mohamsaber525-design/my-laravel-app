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
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:trips,slug|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'main_image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'available' => 'boolean',
        ]);

        // Upload de l'image
        $imagePath = $request->file('main_image')->store('trips', 'public');

        // Création du voyage avec tous les champs validés
        $trip = Trip::create([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'],
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'main_image' => $imagePath,
            'available' => $validated['available'] ?? true,
        ]);

        return response()->json([
            'message' => 'Trip created successfully',
            'trip' => $trip
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $trip = Trip::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:trips,slug,' . $id . '|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'location' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'duration_days' => 'sometimes|integer|min:1',
            'main_image' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            'available' => 'sometimes|boolean',
        ]);

        // Gérer l'upload d'une nouvelle image si fournie
        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')->store('trips', 'public');
            $validated['main_image'] = $imagePath;
        }

        $trip->update($validated);
        
        return response()->json([
            'message' => 'Trip updated successfully',
            'trip' => $trip
        ]);
    }

    public function destroy($id)
    {
        Trip::destroy($id);
        return ['message' => 'Trip deleted'];
    }
}
