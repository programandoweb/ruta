<?php

namespace App\Http\Controllers\V1\Routes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RouteGeo;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\RouteCacheBackground;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;


class RoutesGeoController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | POST /open/geo/byName
    |--------------------------------------------------------------------------
    */
    public function setGeoByName(Request $request)
    {
        try {

            $validated = $request->validate([
                'username'  => 'required|string|max:100',
                'lat'       => 'required|numeric',
                'lng'       => 'required|numeric',
                'battery'   => 'nullable|integer',
                'timestamp' => 'nullable|numeric',
            ]);

            $deviceTime = null;

            if (!empty($validated['timestamp'])) {
                // timestamp viene en milisegundos
                $deviceTime = Carbon::createFromTimestampMs($validated['timestamp']);
            }

            $geo = RouteGeo::create([
                'alias'            => $validated['username'],
                'latitude'         => $validated['lat'],
                'longitude'        => $validated['lng'],
                'battery_level'    => $validated['battery'] ?? null,
                'device_timestamp' => $deviceTime ?? now(),
                'ip'               => $request->ip(),
                'user_agent'       => $request->userAgent(),
                'raw_payload'      => $request->all(),
            ]);

            return response()->success(
                ['id' => $geo->id],
                'Geolocalización registrada correctamente.'
            );

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GET /open/geo/byName?username=Carlos Ruta 1
    |--------------------------------------------------------------------------
    */
    public function getGeoByName(Request $request)
    {
        try {

            if (!$request->filled('username')) {
                return response()->error('Username requerido.', 422);
            }

            $geo = RouteGeo::where('alias', $request->username)
                ->latest('id')
                ->first();

            return response()->success(
                ['geo' => $geo],
                'Última ubicación obtenida correctamente.'
            );

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GET /open/geo
    |--------------------------------------------------------------------------
    */
    public function getGeo(Request $request)
    {
        try {

            $query = RouteGeo::query();

            if ($request->filled('username')) {
                $query->where('alias', $request->username);
            }

            if ($request->filled('from')) {
                $query->whereDate('created_at', '>=', $request->from);
            }

            if ($request->filled('to')) {
                $query->whereDate('created_at', '<=', $request->to);
            }

            $data = $query
                ->orderBy('created_at', 'desc')
                ->limit(500)
                ->get();

            return response()->success(
                [
                    'count' => $data->count(),
                    'data'  => $data
                ],
                'Historial obtenido correctamente.'
            );

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GET /open/geoAllDivices
    |--------------------------------------------------------------------------
    */
    public function geoAllDivices()
    {
        try {

            $sub = DB::table('route_geos')
                ->selectRaw('MAX(id) as id')
                ->groupBy('alias');

            $latestGeos = RouteGeo::whereIn('id', $sub)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->success(
                [
                    'count' => $latestGeos->count(),
                    'data'  => $latestGeos
                ],
                'Última ubicación de todos los dispositivos.'
            );

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    /*
    |--------------------------------------------------------------------------
    | POST /open/routes/geolocation/sync
    |--------------------------------------------------------------------------
    */

    public function syncAddressGeo()
{
    try {

        $endpoints = [
            'https://backend.latinoexpress-cargo.com/api/v1/open/box-list/delivery_box/304',
            'https://app.movexlogistica.com/api/v1/open/box-list/delivery_box/308',
        ];

        $boxes = [];

        foreach ($endpoints as $endpoint) {

            $response = Http::timeout(30)->get($endpoint);

            if ($response->successful()) {
                $data  = data_get($response->json(), 'data', []);
                $boxes = array_merge($boxes, $data);
            }
        }

        $results = [];

        $apiKey = env('GEMINI_API_KEY');
        $url    = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        foreach ($boxes as $box) {

            $guide   = $box['guideNumber'] ?? null;
            $address = $box['output_address'] ?? null;

            if (!$guide || !$address) {
                $results[] = [
                    'guide'  => $guide,
                    'status' => 'skipped',
                    'reason' => 'Guide o address vacío'
                ];
                continue;
            }

            if (RouteCacheBackground::where('guide', $guide)->exists()) {
                $results[] = [
                    'guide'  => $guide,
                    'status' => 'exists'
                ];
                continue;
            }

            $prompt = <<<EOT
Devuélveme EXCLUSIVAMENTE un JSON válido con este formato:

{
  "lat": 0.0,
  "lng": 0.0
}

Geolocaliza esta dirección en Estados Unidos:

{$address}

REGLAS:
- No agregues texto adicional.
- No uses bloques markdown.
- Solo JSON válido.
- Si no encuentras coordenadas devuelve:
{ "lat": null, "lng": null }
EOT;

            $geminiResponse = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->timeout(120)->post($url, [
                'contents' => [[
                    'role'  => 'user',
                    'parts' => [['text' => $prompt]]
                ]]
            ]);

            if (!$geminiResponse->successful()) {

                $results[] = [
                    'guide'  => $guide,
                    'status' => 'error',
                    'reason' => 'Gemini HTTP error'
                ];
                continue;
            }

            $rawText = data_get(
                $geminiResponse->json(),
                'candidates.0.content.parts.0.text',
                ''
            );

            $clean = trim($rawText);
            $clean = preg_replace('/^```json\s*|```$/m', '', $clean);

            $decoded = json_decode($clean, true);

            if (
                json_last_error() !== JSON_ERROR_NONE ||
                !isset($decoded['lat'], $decoded['lng'])
            ) {
                $results[] = [
                    'guide'  => $guide,
                    'status' => 'error',
                    'reason' => 'JSON inválido',
                    'ia_raw' => $rawText
                ];
                continue;
            }

            if (is_null($decoded['lat']) || is_null($decoded['lng'])) {
                $results[] = [
                    'guide'  => $guide,
                    'status' => 'no_results'
                ];
                continue;
            }

            RouteCacheBackground::updateOrCreate(
                ['guide' => $guide],
                [
                    'geo' => [
                        'lat'      => (float) $decoded['lat'],
                        'lng'      => (float) $decoded['lng'],
                        'address'  => $address,
                        'provider' => 'gemini'
                    ]
                ]
            );

            $results[] = [
                'guide'  => $guide,
                'status' => 'success',
                'lat'    => (float) $decoded['lat'],
                'lng'    => (float) $decoded['lng']
            ];
        }

        return response()->success(
            [
                'total'   => count($results),
                'results' => $results
            ],
            'Sincronización Gemini completada.'
        );

    } catch (\Throwable $e) {
        return response()->error($e->getMessage(), 500);
    }
}



    public function syncAddressGeo666()
    {
        try {

            $endpoint = 'https://backend.latinoexpress-cargo.com/api/v1/open/box-list/delivery_box/304';

            $response = Http::timeout(30)->get($endpoint);

            if (!$response->successful()) {
                return response()->error('Error consultando endpoint externo.', 500);
            }

            $boxes   = data_get($response->json(), 'data', []);
            $results = [];

            $apiKey = env('GEMINI_API_KEY');
            $url    = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";

            foreach ($boxes as $box) {

                $guide   = $box['guideNumber'] ?? null;
                $address = $box['output_address'] ?? null;

                if (!$guide || !$address) {
                    $results[] = [
                        'guide'  => $guide,
                        'status' => 'skipped',
                        'reason' => 'Guide o address vacío'
                    ];
                    continue;
                }

                if (RouteCacheBackground::where('guide', $guide)->exists()) {
                    $results[] = [
                        'guide'  => $guide,
                        'status' => 'exists'
                    ];
                    continue;
                }

                /**
                 * ==========================
                 * 🧠 Prompt estructurado
                 * ==========================
                 */
                $prompt = <<<EOT
    Devuélveme EXCLUSIVAMENTE un JSON válido con este formato:

    {
    "lat": 0.0,
    "lng": 0.0
    }

    Geolocaliza esta dirección en Estados Unidos:

    {$address}

    REGLAS:
    - No agregues texto adicional.
    - No uses bloques markdown.
    - Solo JSON válido.
    - Si no encuentras coordenadas devuelve:
    { "lat": null, "lng": null }
    EOT;

                $geminiResponse = Http::withHeaders([
                    'Content-Type' => 'application/json'
                ])->timeout(120)->post($url, [
                    'contents' => [[
                        'role'  => 'user',
                        'parts' => [['text' => $prompt]]
                    ]]
                ]);

                if (!$geminiResponse->successful()) {

                    $results[] = [
                        'guide'  => $guide,
                        'status' => 'error',
                        'reason' => 'Gemini HTTP error'
                    ];
                    continue;
                }

                $rawText = data_get(
                    $geminiResponse->json(),
                    'candidates.0.content.parts.0.text',
                    ''
                );

                $clean = trim($rawText);
                $clean = preg_replace('/^```json\s*|```$/m', '', $clean);

                $decoded = json_decode($clean, true);

                if (
                    json_last_error() !== JSON_ERROR_NONE ||
                    !isset($decoded['lat'], $decoded['lng'])
                ) {
                    $results[] = [
                        'guide'   => $guide,
                        'status'  => 'error',
                        'reason'  => 'JSON inválido',
                        'ia_raw'  => $rawText
                    ];
                    continue;
                }

                if (is_null($decoded['lat']) || is_null($decoded['lng'])) {
                    $results[] = [
                        'guide'  => $guide,
                        'status' => 'no_results'
                    ];
                    continue;
                }

                RouteCacheBackground::create([
                    'guide' => $guide,
                    'geo'   => [
                        'lat'      => (float) $decoded['lat'],
                        'lng'      => (float) $decoded['lng'],
                        'address'  => $address,
                        'provider' => 'gemini'
                    ]
                ]);

                $results[] = [
                    'guide'  => $guide,
                    'status' => 'success',
                    'lat'    => (float) $decoded['lat'],
                    'lng'    => (float) $decoded['lng']
                ];
            }

            return response()->success(
                [
                    'total'   => count($results),
                    'results' => $results
                ],
                'Sincronización Gemini completada.'
            );

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }





public function syncAddressGeoCache()
{
    try {



        $endpoint = 'https://backend.latinoexpress-cargo.com/api/v1/open/box-list/delivery_box/304';

        $response = Http::timeout(30)->get($endpoint);

        if (!$response->successful()) {
            return response()->error('Error consultando endpoint externo.', 500);
        }

        $boxes = data_get($response->json(), 'data', []);
        $processed = [];

        $gmapsKey = "AIzaSyA8YOIsq2Mizv_O6ArQim-erlw04DMQsiM";

        if (!$gmapsKey) {
            return response()->error('Google API Key no configurada.', 500);
        }

        foreach ($boxes as $box) {

            $guide   = $box['guideNumber'] ?? null;
            $address = $box['output_address'] ?? null;

            if (!$guide || !$address) {
                continue;
            }

            if (RouteCacheBackground::where('guide', $guide)->exists()) {
                continue;
            }

            
            /**
             * ==========================
             * 🔵 Geocodificación robusta
             * ==========================
             */
            $coords = Cache::remember(
                'gmaps_geocode_sync:' . md5('US|' . $address),
                now()->addDays(7),
                function () use ($address, $gmapsKey) {

                    $url = 'https://maps.googleapis.com/maps/api/geocode/json';

                    $params = [
                        'address'    => $address,
                        'key'        => $gmapsKey,
                        'language'   => 'en',
                        'region'     => 'us',
                        'components' => 'country:US',
                    ];

                    $maxAttempts = 5;
                    $delayMs     = 400;

                    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {

                        $resp = Http::timeout(15)->get($url, $params);

                        if (!$resp->successful()) {
                            usleep($delayMs * 1000);
                            $delayMs *= 2;
                            continue;
                        }

                        $json   = $resp->json() ?? [];
                        $status = $json['status'] ?? 'UNKNOWN';

                        if ($status === 'OK') {

                            $results = $json['results'] ?? [];

                            if (empty($results)) {
                                return null;
                            }

                            // Preferir ROOFTOP
                            $pick = null;
                            foreach ($results as $r) {
                                if (data_get($r, 'geometry.location_type') === 'ROOFTOP') {
                                    $pick = $r;
                                    break;
                                }
                            }

                            if (!$pick) {
                                $pick = $results[0];
                            }

                            $loc = data_get($pick, 'geometry.location');

                            if (isset($loc['lat'], $loc['lng'])) {
                                return [
                                    'lat' => (float) $loc['lat'],
                                    'lng' => (float) $loc['lng'],
                                    'raw' => $json
                                ];
                            }

                            return null;
                        }

                        if (in_array($status, ['OVER_QUERY_LIMIT', 'RESOURCE_EXHAUSTED'])) {
                            usleep($delayMs * 1000);
                            $delayMs *= 2;
                            continue;
                        }

                        if ($status === 'ZERO_RESULTS') {
                            return null;
                        }

                        return null;
                    }

                    return null;
                }
            );

            if (!$coords) {
                continue;
            }

            RouteCacheBackground::create([
                'guide' => $guide,
                'geo'   => [
                    'lat'       => $coords['lat'],
                    'lng'       => $coords['lng'],
                    'address'   => $address,
                    'provider'  => 'google_geocoding',
                    'raw'       => $coords['raw'] ?? null,
                ]
            ]);

            $processed[] = $guide;
        }

        return response()->success(
            ['processed' => $processed],
            'Geolocalización sincronizada correctamente.'
        );

    } catch (\Throwable $e) {
        return response()->error($e->getMessage(), 500);
    }
}



}
