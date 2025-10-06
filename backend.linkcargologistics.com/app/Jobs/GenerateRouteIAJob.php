<?php

namespace App\Jobs;

use App\Models\Routes;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateRouteIAJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $routeId;

    public function __construct($routeId)
    {
        $this->routeId = $routeId;
    }

    public function handle()
    {
        $route = Routes::with('items')->find($this->routeId);
        if (!$route) return;

        $route->update(['ia_status' => 'processing']);

        try {
            $addresses = $route->items->pluck('origin_address')->toArray();
            $addressList = collect($addresses)->map(fn($a, $i) => ($i+1) . ". " . $a)->implode("\n");

            $prompt = <<<EOT
Actúa como un asistente experto en logística y optimización de rutas.
Analiza las siguientes direcciones y genera una hoja de ruta optimizada
en formato texto y JSON.
Direcciones:
{$addressList}
EOT;

            $apiKey = env('GEMINI_API_KEY');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

            $response = Http::timeout(600)->post($url, [
                'contents' => [[ 'role' => 'user', 'parts' => [['text' => $prompt]] ]]
            ]);

            if ($response->failed()) {
                $route->update([
                    'ia_status' => 'failed',
                    'cache_json' => 'Error: ' . $response->body(),
                ]);
                return;
            }

            $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');
            $routePlan = null;
            $dataset = [];

            if ($generatedText) {
                $parts = explode('---', $generatedText, 2);
                $routePlan = trim(str_replace('### Hoja de Ruta', '', $parts[0] ?? ''));

                if (isset($parts[1])) {
                    if (preg_match('/```json\s*([\s\S]*?)\s*```/', $parts[1], $matches)) {
                        $dataset = json_decode($matches[1], true) ?? [];
                    }
                }
            }

            $iaData = [
                'hoja_de_ruta' => $routePlan,
                'dataset' => $dataset,
                'addressListString' => $addressList
            ];

            $route->update([
                'cache_json' => json_encode($iaData, JSON_UNESCAPED_UNICODE),
                'ia_status' => 'done'
            ]);

        } catch (\Throwable $e) {
            Log::error("Error en IA Job: " . $e->getMessage());
            $route->update(['ia_status' => 'failed']);
        }
    }
}
