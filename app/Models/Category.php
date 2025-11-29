<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',        // ex: "Désert", "Mer", "Montagne"
        'slug',
        'description',
    ];

    /**
     * Une catégorie contient plusieurs trips.
     */
    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
}

