<?php

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');
            $table->string('name'); // Corresponds to 'name' in your data
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->enum('unit', ['unitario', 'mensual', 'anual'])->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('contact_phone')->nullable(); // Corresponds to 'phone_number' in your data
            $table->string('contact_email')->nullable();
            $table->string('whatsapp_link')->nullable();
            $table->string('location')->nullable();

            // --- Missing Fields Based on Your JSON Data ---
            $table->boolean('allow_comments')->default(false);    // Added: To control comments
            $table->boolean('allow_location')->default(false);    // Added: To control location visibility
            $table->integer('category_id')->unsigned()->nullable();            
            $table->foreign('category_id')->on('services')->references('id')->onDelete('cascade');
            // --- End Missing Fields ---
            
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};