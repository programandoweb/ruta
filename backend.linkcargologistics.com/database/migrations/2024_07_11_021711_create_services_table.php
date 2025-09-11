<?php

// database/migrations/2023_01_01_000000_create_services_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('pathname');
            $table->text('description')->nullable();
            $table->text('image')->nullable();
            $table->text('cover')->nullable();
            $table->enum('type', ['products', 'services'])->default('services');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
