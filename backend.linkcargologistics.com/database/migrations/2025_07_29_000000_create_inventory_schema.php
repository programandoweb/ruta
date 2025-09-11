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


// database/migrations/2025_07_28_000000_create_inventory_schema.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        /*
        Schema::create('units', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 16)->unique(); // g, kg, ml, l, ud, etc.
            $table->string('name');
            $table->decimal('ratio_to_base', 20, 8)->default(1); // conversión a unidad base del item
            $table->timestamps();
        });
        */

        

        /*
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('sku')->unique();
            $table->string('name');
            $table->decimal('price', 20, 6);
            $table->timestamps();
        });
        */

        Schema::create('recipes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('product_id')->unsigned()->nullable();
            $table->foreign('product_id')->on('products')->references('id')->onDelete('cascade');
            $table->decimal('yield_qty', 20, 6)->default(1); // rendimiento (ej: receta rinde 1 hamburguesa)
            $table->foreignId('yield_unit_id')->nullable()->constrained('units');
            $table->timestamps();
        });
        /*
        Schema::create('recipe_components', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items');
            $table->foreignId('unit_id')->constrained('units'); // unidad en la que se definió qty
            $table->decimal('qty', 20, 6); // cantidad por rendimiento de la receta
            $table->decimal('waste_pct', 5, 2)->default(0); // merma opcional
            $table->timestamps();

            $table->unique(['recipe_id', 'inventory_item_id']);
        });

        Schema::create('stock_ledger', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('inventory_item_id')->constrained('inventory_items');
            $table->decimal('qty', 20, 6); // negativa = salida
            $table->decimal('cost', 20, 6)->default(0); // costo unitario aplicado
            $table->morphs('reference'); // reference_type, reference_id (Order, Purchase, Adjustment, etc.)
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['inventory_item_id', 'created_at']);
        });
        */

        /*
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('total', 20, 6)->default(0);
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('qty', 20, 6);
            $table->decimal('price', 20, 6);
            $table->timestamps();
        });
        */
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('stock_ledger');
        Schema::dropIfExists('recipe_components');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('products');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('units');
    }
};
