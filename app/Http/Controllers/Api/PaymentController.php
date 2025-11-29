<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string',
        ]);

        return Payment::create($validated);
    }
}
