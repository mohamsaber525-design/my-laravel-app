<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'day_number',
        'title',
        'description',
    ];

    protected $casts = [
        'day_number' => 'integer',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
