<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('event_tasks', function (Blueprint $table) {
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
            $table->string('name'); // Ej.: 'Alquiler de sillas'
            $table->text('description')->nullable(); // Detalles adicionales
            $table->dateTime('start_date')->nullable(); // Fecha de inicio de la tarea
            $table->dateTime('due_date')->nullable(); // Fecha límite de la tarea
            $table->enum('status', ['pendiente', 'en_progreso', 'completada', 'cancelada'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_tasks');
    }
};
