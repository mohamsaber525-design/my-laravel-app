<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'user_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'date_reservation',
        'people_count',
        'status',         // pending, confirmed, cancelled
        'total_amount',
    ];

    protected $casts = [
        'date_reservation' => 'date',
        'people_count' => 'integer',
        'total_amount' => 'decimal:2',
    ];

    // Relations
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
