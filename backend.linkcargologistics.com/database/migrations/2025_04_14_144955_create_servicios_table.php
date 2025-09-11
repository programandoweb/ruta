<?php

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
        Schema::create('servicios', function (Blueprint $table) {
            $table->increments('id');
            
            // Relaciones
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('product_category_id')->unsigned()->nullable();
            $table->integer('category_id')->unsigned()->nullable();            
            
            // Datos del servicio
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('rating')->nullable(); // 0-5 estrellas
            $table->string('image')->nullable();
            $table->string('location')->nullable();
            $table->longtext('map')->nullable();
            $table->json('gallery')->nullable(); // Array JSON de imágenes
            $table->enum('type', ['products', 'services','professional_profile'])->default('services');
            $table->timestamps();

            // Claves foráneas
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');
            $table->foreign('category_id')->on('services')->references('id')->onDelete('cascade');

            $table->foreign('product_category_id')->on('product_categories')->references('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
