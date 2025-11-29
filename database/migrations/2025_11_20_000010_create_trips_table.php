<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->string('location');             // Ville / région
            $table->string('main_image')->nullable();

            $table->decimal('price', 10, 2);
            $table->integer('duration_days');

            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            $table->boolean('available')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
