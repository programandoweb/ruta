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

        // Número de Guía
        $table->string('guide');

        $table->longtext('evidence_urls')->nullable();
        $table->json('json_status')->nullable();

        $table->string('guide_remote')->nullable();

        // Datos de cada parada
        $table->string('name')->nullable();
        $table->string('phone');
        $table->string('origin_address');
        $table->string('destination_address')->nullable();
        $table->longtext('observation')->nullable();
        $table->enum('type', ['deliver', 'pickup']);

        $table->enum('status', [
            'Borrador',
            'Agendado',
            'En proceso',
            'Rechazado',
            'Cancelado',
        ])->default('Borrador');

        // ✅ Coordenadas para enrutamiento
        $table->decimal('lat', 10, 7)->nullable();
        $table->decimal('lng', 10, 7)->nullable();

        $table->integer('day')->nullable()->default(0);

        // ✅ (Opcional) fecha de caché de geolocalización
        $table->timestamp('geo_cached_at')->nullable();

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
