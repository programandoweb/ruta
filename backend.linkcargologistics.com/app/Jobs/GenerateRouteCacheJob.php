<?php

namespace App\Jobs;

use App\Models\Routes;
use App\Http\Controllers\V1\Routes\RoutesController;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateRouteCacheJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $routeId;

    public function __construct($routeId)
    {
        $this->routeId = $routeId;
    }

    public function handle(): void
    {
        try {
            $controller = new RoutesController();
            $controller->show_cache_fisico($this->routeId);
        } catch (\Throwable $e) {
            Log::error("❌ Error ejecutando cronjob IA (route_id: {$this->routeId}): " . $e->getMessage());
        }
    }
}
