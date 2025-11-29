<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('trip_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()  
                ->constrained()
                ->cascadeOnDelete();

            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone')->nullable();

            $table->date('date_reservation');
            $table->integer('people_count');

            $table->enum('status', ['pending', 'confirmed', 'cancelled'])
                ->default('pending');

            $table->decimal('total_amount', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
