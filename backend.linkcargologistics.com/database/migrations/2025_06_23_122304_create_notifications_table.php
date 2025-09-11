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
        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('id');

            // Usuario que genera la notificación
            $table->unsignedInteger('from_user_id')->nullable();
            $table->foreign('from_user_id')->references('id')->on('users')->onDelete('set null');

            // Usuario que recibe la notificación
            $table->unsignedInteger('to_user_id');
            $table->foreign('to_user_id')->references('id')->on('users')->onDelete('cascade');

            // Estado de lectura: leído o no leído
            $table->enum('status', ['no leido', 'leido'])->default('no leido');

            // Concepto o título breve de la notificación
            $table->string('concepto');

            // Descripción completa de la notificación
            $table->text('descripcion')->nullable();

            // Tipo de notificación (opcional): sistema, recordatorio, mensaje, etc.
            $table->string('tipo')->nullable();
            
            // Tipo de entidad relacionada (evento, servicio, etc.)
            $table->string('related_type')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
