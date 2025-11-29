<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;

class AdminReservationController extends Controller
{
    public function index()
    {
        return Reservation::with(['trip','user'])->get();
    }

    public function updateStatus($id)
    {
        $res = Reservation::findOrFail($id);
        $res->status = request('status');
        $res->save();

        return $res;
    }
}
