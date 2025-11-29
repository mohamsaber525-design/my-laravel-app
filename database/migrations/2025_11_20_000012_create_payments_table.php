<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reservation_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('amount', 10, 2);

            $table->string('payment_method');  // paypal, stripe, cmi...
            $table->string('payment_status')->default('pending'); // pending|succeeded|failed

            $table->string('transaction_id')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
