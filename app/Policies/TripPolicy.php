<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Trip;

class TripPolicy
{
    public function viewAny(User $user) {
        return true;
    }

    public function view(User $user, Trip $trip) {
        return true;
    }

    public function create(User $user) {
        return $user->role === 'admin';
    }

    public function update(User $user, Trip $trip) {
        return $user->role === 'admin';
    }

    public function delete(User $user, Trip $trip) {
        return $user->role === 'admin';
    }
}
