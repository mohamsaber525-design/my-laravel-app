<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'user_id',
        'rating',       // ex: 1-5
        'comment',
        'approved',     // boolean (si modération)
    ];

    protected $casts = [
        'rating' => 'integer',
        'approved' => 'boolean',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
