<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

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
        Schema::create('routes', function (Blueprint $table) {
            $table->increments('id');

            // Relación con usuario creador (opcional)
            $table->unsignedInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedInteger('employees_id')->nullable();
            $table->foreign('employees_id')->references('id')->on('users')->onDelete('set null');

            // Nombre de la ruta (opcional)
            $table->string('name')->nullable();

            // Celular
            $table->string('phone', 20)->nullable();

            // Dirección de origen
            $table->string('origin_address');

            // Dirección de destino
            $table->string('destination_address');

            // Tipo de movimiento (deliver, pickup)
            $table->enum('type', ['deliver', 'pickup']);

            // Fecha programada
            $table->date('date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
