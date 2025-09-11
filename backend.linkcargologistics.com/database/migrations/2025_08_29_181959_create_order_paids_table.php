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
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_paids', function (Blueprint $table) {
            $table->increments('id');

            // Relación con la orden
            $table->integer('order_id')->unsigned()->nullable();
            $table->foreign('order_id')->on('orders')->references('id')->onDelete('cascade');

            // Relación con el usuario que registra el pago
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->on('users')->references('id')->onDelete('set null');

            // Mesa (ej: mesa_264 -> 264)
            $table->integer('table_id')->unsigned()->nullable();

            // Datos del pago
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('method', 100); // transferencia, efectivo, otro
            $table->string('note')->nullable();

            // Guardar ítems pagados en JSON
            $table->json('items')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_paids');
    }
};
