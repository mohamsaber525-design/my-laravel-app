<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        // Récupérer les 3 derniers avis avec l'utilisateur associé
        $reviews = Review::with('user')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        $review = Review::create($validated);
        
        // Retourner la review avec l'utilisateur pour l'affichage direct
        return $review->load('user');
    }
}
