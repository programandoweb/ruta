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
        Schema::create('route_items', function (Blueprint $table) {
            $table->increments('id');

            // Relación con la ruta maestra
            $table->integer('route_id')->unsigned();
            $table->foreign('route_id')->on('routes')->references('id')->onDelete('cascade');

            // Datos de cada parada
            $table->string('name')->nullable(); // Nombre opcional
            $table->string('phone'); // Celular
            $table->string('origin_address'); // Dirección origen
            $table->string('destination_address'); // Dirección destino
            $table->enum('type', ['deliver', 'pickup']); // Dejar caja o recoger caja
            // Estado en español
            $table->enum('status', [
                'Borrador',
                'Agendado',
                'En proceso',
                'Rechazado',
                'Cancelado',
            ])->default('Borrador');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_items');
    }
};
