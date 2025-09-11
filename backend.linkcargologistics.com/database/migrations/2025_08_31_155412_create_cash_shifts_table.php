<?php
// database/migrations/XXXX_XX_XX_XXXXXX_create_cash_shifts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cash_shifts', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('opened_by')->unsigned()->nullable();
            $table->foreign('opened_by')->on('users')->references('id')->onDelete('set null');

            $table->integer('closed_by')->unsigned()->nullable();
            $table->foreign('closed_by')->on('users')->references('id')->onDelete('set null');

            $table->decimal('opening_amount', 12, 2);              // fondo fijo (200000)
            $table->decimal('closing_amount_expected', 12, 2)->nullable();
            $table->decimal('closing_amount_real', 12, 2)->nullable();

            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();

            $table->enum('status', ['open','closed'])->default('open');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_shifts');
    }
};
