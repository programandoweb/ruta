<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_cache_backgrounds', function (Blueprint $table) {
            $table->id();

            // Número de guía
            $table->string('guide')->unique()->index();

            // Geolocalización en JSON
            // Ej: { "lat": 6.2442, "lng": -75.5812, "formatted_address": "...", "raw": {...} }
            $table->json('geo')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_cache_backgrounds');
    }
};
