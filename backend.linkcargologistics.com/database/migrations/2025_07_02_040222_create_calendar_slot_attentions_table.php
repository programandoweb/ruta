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
        Schema::create('calendar_slot_attentions', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('slot_id')->unsigned();
            $table->foreign('slot_id')->references('id')->on('calendar_slots')->onDelete('cascade');

            $table->enum('status', ['pendiente', 'atendida', 'cancelada'])->default('pendiente');
            $table->longText('notes')->nullable();

            $table->timestamps();

            $table->index('slot_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_slot_attentions');
    }
};
