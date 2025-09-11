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
        Schema::create('order_items', function (Blueprint $table) {
            $table->increments('id');

            // Relación con la orden
            $table->integer('order_id')->unsigned()->nullable();
            $table->foreign('order_id')->on('orders')->references('id')->onDelete('cascade');
            
            // Relación con producto (puede venir de tu tabla products o raw_materials)
            $table->unsignedBigInteger('product_id')->nullable();

            // Datos del ítem
            $table->string('name'); // redundancia para congelar el nombre del producto
            $table->string('category')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('price', 12, 2)->default(0);
            $table->string('description')->nullable();

            $table->decimal('subtotal', 12, 2)->default(0);

            $table->enum('status', [
                'En Espera', //La mesa está sola
                'Pagada', //Se pagó esta orden
                'Cancelada', //Se canceló esta orden y la mesa está disponible                
            ])->default('En Espera');

            $table->integer('delete_by_id')->unsigned()->nullable();
            $table->foreign('delete_by_id')->on('users')->references('id')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
