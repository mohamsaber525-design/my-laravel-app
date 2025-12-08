<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Désert',
                'slug' => 'desert',
                'description' => 'Voyages dans le désert du Sahara',
            ],
            [
                'name' => 'Montagne',
                'slug' => 'montagne',
                'description' => 'Randonnées et excursions en montagne',
            ],
            [
                'name' => 'Plage',
                'slug' => 'plage',
                'description' => 'Détente et activités balnéaires',
            ],
            [
                'name' => 'Villes Impériales',
                'slug' => 'villes-imperiales',
                'description' => 'Découverte des villes historiques',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
