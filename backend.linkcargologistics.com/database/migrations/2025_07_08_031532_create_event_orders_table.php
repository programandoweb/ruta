<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_orders', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('client_id')->unsigned()->nullable();
            $table->foreign('client_id')->on('users')->references('id')->onDelete('cascade');
            $table->integer('provider_id')->unsigned()->nullable();
            $table->foreign('provider_id')->on('users')->references('id')->onDelete('cascade');
            $table->integer('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->on('users')->references('id')->onDelete('cascade');
            $table->integer('event_id')->unsigned()->nullable();
            $table->foreign('event_id')->on('events')->references('id')->onDelete('cascade');
            $table->integer('servicio_id')->unsigned()->nullable();
            $table->foreign('servicio_id')->on('servicios')->references('id')->onDelete('cascade');
            $table->integer('calendar_slot_id')->unsigned()->nullable();
            $table->foreign('calendar_slot_id')->on('calendar_slots')->references('id')->onDelete('cascade');
            $table->decimal('price', 10, 2)->default(0)->nullable();
            $table->integer('quantity')->default(0)->nullable();
            $table->enum('status', ['pendiente', 'en_progreso', 'completada', 'cancelada'])->default('pendiente'); // ← agregado
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_orders');
    }
};
