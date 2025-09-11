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
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');

            // Relación con servicios
            $table->unsignedInteger('servicio_id')->nullable();;
            $table->foreign('servicio_id')->references('id')->on('servicios')->onDelete('cascade');

            // Información básica
            $table->string('name');
            $table->string('barcode')->nullable();
            $table->string('brand')->nullable();

            $table->json('gallery')->nullable(); // Array JSON de imágenes

            // Medidas
            $table->enum('measure_unit', [
                'ml', 'l', 'fl_oz', 'g', 'kg', 'gal', 'oz', 'lb', 'cm', 'ft', 'in', 'unit'
            ])->nullable();
            $table->decimal('measure_quantity', 10, 2)->nullable();

            // Descripciones
            $table->string('short_description', 100)->nullable();
            $table->text('long_description')->nullable();

            // Categoría del producto
            //$table->string('category_name')->nullable()->default('General');
            $table->integer('product_category_id')->unsigned();
            $table->foreign('product_category_id')->references('id')->on('product_categories')->onDelete('cascade');

            // Stock e inventario
            $table->boolean('stock_control')->default(false);
            $table->integer('stock_current')->default(0);
            $table->integer('stock_alert_level')->default(0);
            $table->integer('stock_reorder_amount')->default(0);
            $table->boolean('stock_notifications_enabled')->default(false);

            // Información adicional existente
            $table->string('model')->nullable();
            $table->string('color')->nullable();
            $table->string('sku')->unique();
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->decimal('cost', 10, 2)->default(0);
            $table->decimal('price', 10, 2)->default(0);

            // Relación con proveedor
            $table->unsignedInteger('provider_id')->nullable();
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
