<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        return Review::create($validated);
    }
}
