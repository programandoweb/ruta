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
        Schema::create('master_tables', function (Blueprint $table) {
            $table->increments('id');
            $table->string('label');
            $table->string('grupo');            
            $table->longtext('value')->nullable();
            $table->integer('conversion')->nullable()->unsigned()->default(null);
            $table->string('description')->nullable();
            $table->longtext('options')->nullable();
            $table->integer('medida_id')->nullable()->unsigned()->default(null);
            $table->foreign('medida_id')->on('master_tables')->references('id')->onDelete('cascade');
            $table->integer('bool_status')->nullable()->unsigned()->default(1);
            $table->string('icon')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_tables');
    }
};
