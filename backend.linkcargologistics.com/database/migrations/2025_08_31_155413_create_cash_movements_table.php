<?php
// database/migrations/XXXX_XX_XX_XXXXXX_create_cash_movements_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('cash_shift_id')->unsigned();
            $table->foreign('cash_shift_id')->on('cash_shifts')->references('id')->onDelete('cascade');

            $table->enum('type', ['apertura','ingreso','egreso','cierre'])->index();
            $table->decimal('amount', 12, 2);

            $table->string('method', 100)->nullable();     // efectivo, tarjeta, etc.
            $table->string('reference', 191)->nullable();  // p.ej. order_paid:123
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_movements');
    }
};
