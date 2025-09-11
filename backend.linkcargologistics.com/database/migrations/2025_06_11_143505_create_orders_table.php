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
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');

            // Nombre del cliente (si aplica)
            $table->string('code');

            $table->integer('table_id')->unsigned()->nullable();
            $table->foreign('table_id')->on('master_tables')->references('id')->onDelete('cascade');

            // Usuario que crea la orden
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->on('users')->references('id')->onDelete('cascade');

            // Nombre del cliente (si aplica)
            $table->string('customer_name')->nullable();

            // Estado de la orden
            $table->enum('status', [
                'En Espera', //La mesa está sola
                'Abierta', //Está ocupada
                'Pausada', //Salió un momento y ya regresa
                'Pendiente de Pago', //Quedó pendiente por pagar
                'Pagada', //Se pagó esta orden
                'Cancelada', //Se canceló esta orden y la mesa está disponible
                'Cerrada' //Se cerró la mesa y está disponible
            ])->default('En Espera');

            // Precio final de la orden
            $table->decimal('total_price', 10, 2)->nullable();

            // Método de pago (opcional)
            $table->string('payment_method')->nullable();

            // Información de contacto o entrega adicional (opcional)
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
