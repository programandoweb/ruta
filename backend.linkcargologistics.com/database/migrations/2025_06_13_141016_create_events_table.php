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
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');

            // Relación con el cliente que genera el evento
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');

            // Información general del evento
            $table->string('title');                            // Ej: Fiesta de Camila
            $table->date('event_date')->nullable();             // Fecha tentativa
            $table->decimal('budget', 12, 2)->nullable();       // Presupuesto estimado
            $table->integer('guests')->nullable();              // Cantidad tentativa de invitados
            $table->text('notes')->nullable();                  // Detalles adicionales

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
