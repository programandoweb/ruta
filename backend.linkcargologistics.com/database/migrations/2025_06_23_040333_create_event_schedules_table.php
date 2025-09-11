<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_schedules', function (Blueprint $table) {
            $table->increments('id');

            // Relación con el evento
            $table->integer('event_id')->nullable()->unsigned();
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');

            // Relación con el cliente que agenda
            $table->integer('client_id')->unsigned();
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');

            //servicio prestado
            $table->integer('servicio_id')->unsigned();
            $table->foreign('servicio_id')->references('id')->on('servicios')->onDelete('cascade');

            // Relación con el proveedor que recibe la cita
            $table->integer('provider_id')->unsigned();
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('cascade');

            // Estado de la agenda: pendiente, agendada o culminada (por defecto: pendiente)
            $table->enum('status', ['pendiente', 'agendada', 'culminada'])->default('pendiente');

            // Fecha y hora programada para la cita
            $table->dateTime('scheduled_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_schedules');
    }
};
