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
        Schema::create('business_galleries', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('business_id')->unsigned()->nullable();
            $table->foreign('business_id')->on('businesses')->references('id')->onDelete('cascade');
            $table->string('image_path')->nullable()->default("https://picsum.photos/200"); // Ruta absoluta
            $table->string('caption')->nullable();            
            $table->timestamps();
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_galleries');
    }
};
