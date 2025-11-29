<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Reservation;

class ReservationPolicy
{
    public function view(User $user, Reservation $reservation) {
        return $user->id === $reservation->user_id || $user->role === 'admin';
    }

    public function update(User $user, Reservation $reservation) {
        return $user->role === 'admin';
    }
}
