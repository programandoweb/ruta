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

        Schema::create('inventory_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name'); // nombre de la categoría
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('inventory_categories_id')->unsigned();
            $table->foreign('inventory_categories_id')->references('id')->on('inventory_categories')->onDelete('cascade');           
            $table->string('sku')->unique();
            $table->string('name');
            $table->foreignId('base_unit_id')->constrained('units');
            $table->decimal('stock', 20, 2)->default(0);
            $table->decimal('avg_cost', 20, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('products_items', function (Blueprint $table) {
            $table->increments('id');

            // Producto asociado
            $table->integer('product_id')->unsigned()->nullable();
            $table->foreign('product_id')->on('products')->references('id')->onDelete('cascade');
            
            // Materia prima utilizada
            $table->integer('inventory_item_id')->unsigned()->nullable();
            $table->foreign('inventory_item_id')->on('inventory_items')->references('id')->onDelete('cascade');
            
            // Unidad en la que se define la cantidad (opcional)
            $table->unsignedBigInteger('unit_id');
            $table->foreign('unit_id')->references('id')->on('units');

            // Cantidad utilizada por unidad de producto
            $table->decimal('qty', 20, 6);

            // Porcentaje de merma opcional
            $table->decimal('waste_pct', 5, 2)->default(0);

            $table->timestamps();

            // Evita duplicados
            $table->unique(['product_id', 'inventory_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products_items');
    }
};
