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
        Schema::create('inventory_movement_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('inventory_movement_id')->unsigned()->nullable();
            $table->foreign('inventory_movement_id')->on('inventory_movements')->references('id')->onDelete('cascade');
            $table->integer('inventory_items_id')->unsigned()->nullable(); //Esto es la materia prima
            $table->foreign('inventory_items_id')->on('inventory_items')->references('id')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_cost', 12, 2)->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movement_items');
    }
};
