<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;

class ReviewPolicy
{
    public function create(User $user) {
        return $user->role === 'user';
    }

    public function delete(User $user, Review $review) {
        return $user->id === $review->user_id || $user->role === 'admin';
    }
}
