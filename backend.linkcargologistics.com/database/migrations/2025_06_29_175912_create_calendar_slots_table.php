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
        Schema::create('calendar_slots', function (Blueprint $table) {
            $table->increments('id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', [
                        'disponible',
                        'reservado',
                        'cancelado',
                        'pendiente',
                        'atendida'
                    ])->default('disponible');

            $table->integer('provider_id')->unsigned();
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('cascade');            
            $table->integer('client_id')->unsigned();
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');            
            $table->integer('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('service_id')->unsigned()->nullable();
            $table->foreign('service_id')->references('id')->on('servicios')->onDelete('cascade');
            $table->timestamps();
            $table->index(['date', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_slots');
    }
};
