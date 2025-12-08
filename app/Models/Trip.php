<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [ // Champs pouvant être assignés en masse
        'title',
        'slug',
        'category_id',
        'short_description',
        'description',
        'price',
        'duration_days',
        'location',       // ville / région
        'main_image',
        'image',
        'available',      // boolean
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean',
        'duration_days' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function details()
    {
        return $this->hasMany(TripDetail::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
