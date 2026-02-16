<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_geos', function (Blueprint $table) {

            $table->id();

            // Identificación desde app
            $table->string('alias')->index(); // nombre ingresado en app
            $table->string('device_id')->nullable()->index();

            // Ubicación
            $table->decimal('latitude', 10, 7)->index();
            $table->decimal('longitude', 10, 7)->index();
            $table->float('accuracy')->nullable();
            $table->float('speed')->nullable();
            $table->float('altitude')->nullable();
            $table->float('bearing')->nullable();

            // Estado dispositivo
            $table->integer('battery_level')->nullable();
            $table->boolean('is_charging')->nullable();

            // Timestamp real del dispositivo
            $table->timestamp('device_timestamp')->nullable()->index();

            // Información red
            $table->ipAddress('ip')->nullable();
            $table->text('user_agent')->nullable();

            // Payload completo opcional
            $table->json('raw_payload')->nullable();

            $table->timestamps();

            // Índice compuesto para consultas por alias + fecha
            $table->index(['alias', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_geos');
    }
};
