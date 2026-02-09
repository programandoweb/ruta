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
        Schema::create('route_assignments', function (Blueprint $table) {
            $table->increments('id');
            // Relación con la ruta maestra
            $table->integer('route_id')->unsigned();
            $table->foreign('route_id')->on('routes')->references('id')->onDelete('cascade');
            $table->string('guide');
            $table->string('guide2');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_assignments');
    }
};
