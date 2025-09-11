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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('reference')->nullable();

            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');

            $table->integer('provider_id')->unsigned()->nullable();
            $table->foreign('provider_id')->on('users')->references('id')->onDelete('cascade');

            $table->integer('client_id')->unsigned()->nullable();
            $table->foreign('client_id')->on('users')->references('id')->onDelete('cascade');            
            
            $table->date('movement_date');
            $table->text('note')->nullable();
            $table->enum('type', ['entrada', 'salida', 'ajuste'])->index();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
