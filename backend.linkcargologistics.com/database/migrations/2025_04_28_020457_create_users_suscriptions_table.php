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
        Schema::create('users_suscriptions', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->unsigned()->nullable();
            
            // Datos del servicio
            $table->string('name');
            $table->text('description')->nullable();
            
            // Fechas de suscripción
            $table->date('start_date');
            $table->date('end_date');

            // Claves foráneas
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_suscriptions');
    }
};
