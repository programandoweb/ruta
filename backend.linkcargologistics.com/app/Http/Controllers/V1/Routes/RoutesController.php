<?php

namespace App\Http\Controllers\V1\Routes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Routes;
use App\Models\RouteItem; // Asegúrate de importar el modelo RouteItem
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use App\Jobs\GenerateRouteCacheJob;
use App\Models\RouteAssignment;





class RoutesController extends Controller
{
    protected $modelId;
    protected $url;

    public function __construct() {
        $apiKey             =    env('GEMINI_API_KEY');
        $this->modelId      =   "gemini-3-flash"; // O "gemini-3-flash-preview"
        $this->url          =   "https://generativelanguage.googleapis.com/v1beta/models/{$this->modelId}:generateContent?key={$apiKey}";
        $this->url          =   "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";
    }

    /**
     * GET /routes
     * Listado paginado de rutas
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->input('per_page', config('constants.RESULT_X_PAGE', 15));

            $query = Routes::select(
                "id",
                "name as Nombre",
                "phone as Teléfono",
                "origin_address as Dirección_Origen",
                "destination_address as Dirección_Destino",
                "type as Tipo",
                "created_at as Fecha"
            )
                ->with('items')
                ->latest('id');

            $user = auth()->user();

            // 🔹 Lógica de filtrado por rol
            if ($user->hasRole('admin')) {
                // Admin → sin filtro
            } elseif ($user->hasRole('employees')) {
                // Employees → filtra por employees_id
                //echo $user->id; exit;
                $query->where('employees_id', $user->id);
            } elseif ($user->hasRole('managers')) {
                // Managers → filtra por user_id
                $query->where('user_id', $user->id);
            } else {
                // Otros roles → acceso restringido a sus propias rutas (por seguridad)
                $query->where('user_id', $user->id);
            }

            $routes = $query->paginate($perPage);

            return response()->success(compact('routes'), 'Listado de rutas.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    /**
     * POST /routes
     * Crear nueva ruta con items hijos
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                // eliminamos `user_id` del request para no permitirlo
                'name'                  => 'nullable|string|max:255',
                'phone'                 => 'required|string|max:20',
                'origin_address'        => 'required|string|max:255',
                'destination_address'   => 'nullable|string|max:255',
                'type'                  => 'required|in:deliver,pickup',
                'date'                  => 'nullable|date',
                'items'                 => 'nullable|array',
                'items.*.guide'                 => 'nullable|string|max:255',
                'items.*.name'                  => 'nullable|string|max:255',
                'items.*.phone'                 => 'required_with:items|string|max:20',
                'items.*.origin_address'        => 'required_with:items|string|max:255',
                'items.*.destination_address'   => 'nullable:items|string|max:255',
                'items.*.type'                  => 'required_with:items|in:deliver,pickup',
                'items.*.status'                => 'nullable|string|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            // Forzamos user_id desde el usuario logueado
            $validated['user_id'] = auth()->id();

            $route = Routes::create($validated);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $route->items()->create($item);
                }
            }

            DB::commit();
            return response()->success(compact('route'), 'Ruta creada correctamente con items.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * GET /routes/{id}
     * Mostrar una ruta específica
     */
    public function show2(string $id)
    {
        try {
            $route = Routes::with('items')->find($id);
            return response()->success(compact('route'), 'Detalle de la ruta.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 404);
        }
    }

    public function showSinCache(string $id)
    {
        try {
            $route = Routes::with('items')->find($id);
            if (!$route) {
                return response()->success([
                    'route'   => $route,
                ], 'Hoja de ruta vacía');
            }

            // 1. Extraer las direcciones de los items de la ruta
            // Usamos pluck para obtener solo la columna 'origin_address' y toArray para convertirla en un array simple.
            $addresses = $route->items->pluck('origin_address')->toArray();

            // Creamos una lista de direcciones formateada para el prompt.
            $addressList = "";
            foreach ($addresses as $index => $address) {
                $addressList .= ($index + 1) . ". " . $address . "\n";
            }

            if ($route->items->isNotEmpty()) {

                // 2. Preparar un prompt mucho más específico para la optimización de rutas
                $prompt = <<<EOT
                Actúa como un asistente experto en logística y optimización de rutas. Tu tarea es crear una hoja de ruta eficiente para un conductor que debe recoger paquetes en varias ubicaciones.

                ### TAREA
                1. Analiza la siguiente lista de direcciones de recogida.
                2. Basado en un mapa (como Google Maps), determina el orden de visita más lógico y eficiente, empezando desde el punto de origen y terminando en el punto de destino.
                3. Genera una "Hoja de Ruta" numerada y clara para el conductor.
                4. Genera un "Dataset" en formato JSON válido con la lista de paradas en el orden correcto, incluyendo coordenadas geográficas estimadas (latitud y longitud).

                ### DATOS DE LA RUTA
                - **Nombre de la Ruta:** {$route->name}
                - **Punto de Origen:** Fresno City Hall, 2600 Fresno St, Fresno, CA 93721
                - **Punto de Destino:** California State Capitol, 1315 10th St, Sacramento, CA 95814
                - **Direcciones de Recogida:**
                {$addressList}

                ### FORMATO DE SALIDA OBLIGATORIO
                Proporciona la respuesta dividida en dos secciones EXACTAS, separadas por "---". No añadas ninguna otra explicación fuera de este formato.

                ### Hoja de Ruta
                [Aquí va la descripción paso a paso, numerada y fácil de leer para el conductor.]

                ---
                ### Dataset JSON
                ```json
                [
                {
                    "order": 1,
                    "address": "Dirección completa de la parada 1",
                    "lat": 36.7378,
                    "lng": -119.7871
                },
                {
                    "order": 2,
                    "address": "Dirección completa de la parada 2",
                    "lat": 37.3382,
                    "lng": -121.8863
                }
                ]
                ```
                EOT;

                $apiKey = env('GEMINI_API_KEY');
                // ✅ CORRECCIÓN DE URL
                $url = $this->url;
                

                // ✅ CORRECCIÓN DE TIMEOUT
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json'
                ])->timeout(350)->post($url, [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]);

                $routePlan = null;
                $dataset = []; // Inicializamos como array vacío

                if ($response->successful()) {
                    $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');

                    if ($generatedText) {
                        // 3. Dividir la respuesta en las dos secciones que pedimos
                        $parts = explode('---', $generatedText, 2);

                        // Procesar la Hoja de Ruta (primera parte)
                        $routePlanText = $parts[0] ?? '';
                        $routePlan = str_replace('### Hoja de Ruta', '', $routePlanText);
                        $routePlan = trim($routePlan);

                        // Procesar el Dataset JSON (segunda parte)
                        if (isset($parts[1])) {
                            $jsonText = $parts[1];
                            // Usamos una expresión regular para extraer el contenido del bloque de código JSON
                            if (preg_match('/```json\s*([\s\S]*?)\s*```/', $jsonText, $matches)) {
                                $jsonString = $matches[1];
                                $dataset = json_decode($jsonString, true); // true para obtener un array asociativo
                            }
                        }
                    }
                } else {
                    // Manejo de error si la API falla
                    $routePlan = "No se pudo generar la hoja de ruta. Error de la API: " . $response->body();
                }

                return response()->success([
                    'route'   => $route,
                    'ia'      => [
                        'hoja_de_ruta' => $routePlan,
                        'dataset'      => $dataset,
                    ]
                ], 'Hoja de ruta y dataset generados por IA.');
            } else {
                return response()->success([
                    'route'   => $route,
                ], 'Hoja de ruta');
            }
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show_ruta_menor_a_mayor(string $id)
    {
        try {
            $route = Routes::with('items')->find($id);

            if (!$route) {
                return response()->success([
                    'route' => $route,
                ], 'Hoja de ruta vacía 1');
            }

            $iaData = [];
            $addressListString = "";

            if ($route->items->isNotEmpty()) {
                $itemsHash = md5($route->items->pluck('id')->toJson());
                $cacheKey = "ia_route2_plan_for_route_{$route->id}_{$itemsHash}";

                $iaData = Cache::remember($cacheKey, now()->addHours(24), function () use ($route) {

                    // 🔹 Quitamos origen y destino → nos quedamos solo con paradas
                    $stops = $route->items->slice(1, -1);

                    // 🔹 Ordenamos de más lejos a más cerca respecto al destino
                    $refLat = 38.5816; // Sacramento
                    $refLng = -121.4944;
                    $stops = $stops->sortByDesc(function ($item) use ($refLat, $refLng) {
                        return sqrt(pow($item->lat - $refLat, 2) + pow($item->lng - $refLng, 2));
                    })->values();

                    // 🔹 Lista de direcciones para el prompt
                    $addresses = $stops->pluck('origin_address')->toArray();
                    $addressList = "";
                    foreach ($addresses as $index => $address) {
                        $addressList .= ($index + 1) . ". " . $address . "\n";
                    }
                    $addressListString = $addressList;

                    // 🔹 Prompt
                    $prompt = <<<EOT
                    Actúa como un asistente experto en logística y optimización de rutas.
                    Tu tarea es crear una hoja de ruta eficiente SOLO con las paradas intermedias (sin incluir origen ni destino).

                    ### TAREA
                    1. Analiza la siguiente lista de paradas.
                    2. Genera una "Hoja de Ruta" numerada y clara para el conductor.
                    3. Genera un "Dataset" en formato JSON válido SOLO con las paradas, en el orden indicado.

                    ### DATOS DE LA RUTA
                    - **Nombre de la Ruta:** {$route->name}
                    - **Paradas intermedias:**
                    {$addressList}

                    ### FORMATO DE SALIDA OBLIGATORIO
                    Proporciona la respuesta dividida en dos secciones EXACTAS, separadas por "---".

                    ### Hoja de Ruta
                    [Aquí va la descripción paso a paso, numerada.]

                    ---
                    ### Dataset JSON
                    ```json
                    [
                    { "order": 1, "address": "Dirección completa de la parada 1", "lat": 36.7378, "lng": -119.7871 }
                    ]
                    ```
                    EOT;

                    // 🔹 Llamada a Gemini
                    $apiKey = env('GEMINI_API_KEY');
                    // ✅ CORRECCIÓN DE URL
                    $url = $this->url;
                    // ✅ CORRECCIÓN DE TIMEOUT
                    $response = Http::timeout(350)->post($url, [
                        'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]]
                    ]);

                    $routePlan = null;
                    $dataset = [];

                    if ($response->successful()) {
                        $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');
                        if ($generatedText) {
                            $parts = explode('---', $generatedText, 2);
                            $routePlanText = $parts[0] ?? '';
                            $routePlan = trim(str_replace('### Hoja de Ruta', '', $routePlanText));

                            if (isset($parts[1])) {
                                if (preg_match('/```json\s*([\s\S]*?)\s*```/', $parts[1], $matches)) {
                                    $dataset = json_decode($matches[1], true) ?? [];
                                }
                            }
                        }
                    } else {
                        $routePlan = "No se pudo generar la hoja de ruta. Error de la API: " . $response->body();
                    }

                    return [
                        'hoja_de_ruta' => $routePlan,
                        'dataset'      => $dataset,
                    ];
                });
            }

            $extra = [];
            if (auth()->user()->hasRole('admin')) {
                $drivers = \App\Models\User::whereHas('roles', function ($q) {
                    $q->where('name', 'employees');
                })->get();
                $extra['drivers'] = $drivers;
            }

            return response()->success(array_merge([
                'route' => $route,
                'ia'    => $iaData,
                'addressListString' => $addressListString
            ], $extra), 'Hoja de ruta obtenida correctamente 2025.');
        } catch (ModelNotFoundException $e) {
            return response()->error('La ruta solicitada no fue encontrada.', 404);
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/routes/{id}/status
     * Consulta el estado del procesamiento de IA
     */
    public function iaStatus(string $id)
    {
        try {
            $route = Routes::select('id', 'name', 'ia_status', 'cache_json')->find($id);

            if (!$route) {
                return response()->error('Ruta no encontrada.', 404);
            }

            $status     = $route->ia_status ?? 'pending';
            $hasCache   = !empty($route->cache_json);

            $this->show_cache_fisico($id);

            $route      = Routes::select('id', 'name', 'ia_status', 'cache_json')->find($id);

            return response()->success([
                'route'     =>  $route,
                'id'        =>  $route->id,
                'status'    =>  $status,
                'hasCache'  =>  $hasCache,
                'completed' =>  $hasCache && $status === 'completed',
            ], 'Estado actual de la IA consultado correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function show(string $id)
    {

        

        try {
            // Paso 1: Cargamos la ruta con sus items.
            $route = Routes::with('items')->find($id);

            if (!$route) {
                return response()->success([
                    'route'  => $route,
                ], 'Hoja de ruta vacía 1');
            }
            
            return $this->show_cache_fisico($id);

            $iaData = []; 
            $addressListString = "";

            // Paso 2: Verificamos si hay items en la ruta.
            if ($route->items->isNotEmpty()) {
                
                // 🔹 Si ya existe cache_json en BD, lo usamos
                if (!empty($route->cache_json)) {
                    $iaData = json_decode($route->cache_json, true);
                } else {
                    /**
                     * Revisión de código es temporal
                     */
                    return $this->show_cache_fisico($id);

                    if (empty($route->cache_json) && $route->ia_status !== 'processing') {
                        $route->update(['ia_status' => 'processing']);
                        GenerateRouteCacheJob::dispatch($route->id);
                    }
                    
                    return response()->success(['route' => $route], 'Ruta encolada, IA procesando...');

                    //GenerateRouteCacheJob::dispatch($route->id);
                    return $this->show_cache_fisico($id);
                    // 🔹 Caso contrario, generamos con Gemini (la lógica original con Cache::remember)

                    $itemsHash  = md5($route->items->pluck('id')->toJson());
                    $cacheKey   = "ia_9route_plan_for_route_{$route->id}_{$itemsHash}";

                    $iaData = Cache::remember($cacheKey, now()->addHours(24), function () use ($route, &$addressListString) {
                        // a. Preparamos la lista de direcciones
                        $addresses = $route->items->pluck('origin_address')->toArray();
                        $addressList = "";
                        foreach ($addresses as $index => $address) {
                            $addressList .= ($index + 1) . ". " . $address . "\n";
                        }
                        $addressListString = $addressList;

                        // b. Prompt
                        $prompt = <<<EOT
                        Actúa como un asistente experto en logística y optimización de rutas...
                        (todo tu prompt original aquí)
                        EOT;

                        $apiKey = env('GEMINI_API_KEY');
                        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
                        $response = Http::timeout(350)->post($url, [
                            'contents' => [[ 'role' => 'user', 'parts' => [['text' => $prompt]] ]]
                        ]);

                        $routePlan = null;
                        $dataset = [];

                        if ($response->successful()) {
                            $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');
                            if ($generatedText) {
                                $parts = explode('---', $generatedText, 2);
                                $routePlanText = $parts[0] ?? '';
                                $routePlan = trim(str_replace('### Hoja de Ruta', '', $routePlanText));

                                if (isset($parts[1])) {
                                    if (preg_match('/```json\s*([\s\S]*?)\s*```/', $parts[1], $matches)) {
                                        $dataset = json_decode($matches[1], true) ?? [];
                                    }
                                }
                            }
                        } else {
                            $routePlan = "No se pudo generar la hoja de ruta. Error de la API: " . $response->body();
                        }

                        return [
                            'hoja_de_ruta' => $routePlan,
                            'dataset'      => $dataset,
                            'addressListString' => $addressListString
                        ];
                    });

                    // 🔹 Guardamos en la BD el resultado como JSON persistente
                    $route->cache_json = json_encode($iaData, JSON_UNESCAPED_UNICODE);
                    $route->save();
                }

                // 🔹 Enriquecimiento del dataset con id_direccion_item (tu código actual)
                if (!empty($iaData['dataset'])) {
                    $normalizeAddress = function ($address) {
                        $address = strtolower($address);
                        $replacements = [
                            ' apt ' => ' apartment ', ' ave ' => ' avenue ', ' st ' => ' street ',
                            ' ln ' => ' lane ', ' dr ' => ' drive ', ' ct ' => ' court ',
                            ' cal ' => ' ca ', ' usa' => ''
                        ];
                        $address = str_replace(array_keys($replacements), array_values($replacements), " $address ");
                        $address = preg_replace('/[^\p{L}\p{N}\s]/u', '', $address);
                        return trim(preg_replace('/\s+/', ' ', $address));
                    };

                    $availableItems = $route->items->keyBy('id')->all();

                    $augmentedDataset = $iaData['dataset'];
                    foreach ($augmentedDataset as &$iaItem) {
                        $iaItem['id_direccion_item'] = null;
                        $bestMatchId = null;
                        $highestSimilarity = 0;
                        $similarityThreshold = 85; 

                        $normalizedIaAddress = $normalizeAddress($iaItem['address']);

                        foreach ($availableItems as $itemId => $dbItem) {
                            $normalizedDbAddress = $normalizeAddress($dbItem->origin_address);
                            similar_text($normalizedIaAddress, $normalizedDbAddress, $percent);

                            if ($percent > $highestSimilarity) {
                                $highestSimilarity = $percent;
                                $bestMatchId = $itemId;
                            }
                        }

                        if ($highestSimilarity >= $similarityThreshold) {
                            $iaItem['id_direccion_item'] = $bestMatchId;
                            unset($availableItems[$bestMatchId]);
                        }
                    }
                    unset($iaItem);

                    $iaData['dataset'] = $augmentedDataset;

                    // 🔹 Importante: guardamos la versión enriquecida de nuevo en BD
                    $route->cache_json = json_encode($iaData, JSON_UNESCAPED_UNICODE);
                    $route->save();
                }
            }

            $extra = [];
            if (auth()->user()->hasRole('admin')) {
                $drivers = \App\Models\User::whereHas('roles', function ($q) {
                    $q->where('name', 'employees');
                })->get();
                $extra['drivers'] = $drivers;
            }

            return response()->success(array_merge([
                'route' => $route,
                'ia'    => $iaData,
                'addressListString' => $addressListString
            ], $extra), 'Hoja de ruta obtenida correctamente con cache_json en BD');

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Ordena paradas con Gemini entre origen y destino y persiste en cache_json.
     */
    private function getItemsAllX1($route)
    {
        $origin       = (string) $route->origin_address;
        $destination  = (string) $route->destination_address;

        // Paradas desordenadas (texto exacto desde BD)
        $stops = [];
        foreach ($route->items as $it) {
            if (!empty($it->origin_address)) {
                $stops[] = $it->origin_address;
            }
        }
        if (empty($stops)) {
            return response()->success(['route' => $route, 'ia' => ['dataset' => []]], 'Sin paradas para ordenar.');
        }

        // Lista para el prompt (una por línea, sin numeración para evitar alteraciones)
        $addressList = implode("\n- ", array_map(fn($a) => trim($a), $stops));
        $addressList = "- " . $addressList;

        // Prompt: pedir SOLO JSON sin fences
        $prompt = <<<EOT
    Actúa como experto en optimización de rutas en California.
    Tarea: ordena cronológicamente las PARADAS intermedias para un recorrido que inicia en:
    ORIGEN: {$origin}
    y finaliza en:
    DESTINO: {$destination}

    importante destacar que la ruta inicia en {$origin} pasa en este orden en California USA: Mendota -> Dos palos -> 
    Los Baños -> Santa Cruz -> san josé -> San MAteo -> Fremont -> San Pablo -> Rodeo -> Dixon -> Sacramento {$destination}

    Restricciones:
    - Usa solo las paradas listadas a continuación.
    - No incluyas el ORIGEN ni el DESTINO en el resultado.
    - No modifiques el texto de las direcciones (respeta acentos, numerales, #, suites).
    - Evita bucles y repeticiones; minimiza distancia/tiempo por red vial real.
    - Devuelve EXCLUSIVAMENTE un JSON válido (sin texto adicional, sin bloques de código), con esta forma:
    [
    { "order": 1, "address": "..." },
    { "order": 2, "address": "..." }
    ]

    PARADAS (desordenadas):
    {$addressList}
    EOT;

        $apiKey = env('GEMINI_API_KEY');
        $url = $this->url;

        $dataset = [];
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(300)->post($url, [
                'contents' => [[
                    'role'  => 'user',
                    'parts' => [['text' => $prompt]],
                ]],
            ]);

            if ($response->successful()) {
                $raw = data_get($response->json(), 'candidates.0.content.parts.0.text', '');

                // 1) Intento directo si viene como JSON puro
                $clean = trim($raw);
                if ($clean !== '' && ($clean[0] ?? '') === '[') {
                    $dataset = json_decode($clean, true) ?? [];
                }

                // 2) Si vino con ruido, intenta extraer JSON mediante regex
                if (empty($dataset)) {
                    if (preg_match('/\[\s*{[\s\S]*}\s*\]/', $raw, $m)) {
                        $dataset = json_decode($m[0], true) ?? [];
                    }
                }
            }
        } catch (\Throwable $e) {
            // Continúa a fallback
        }

        // Fallback: preserva orden actual si la IA no devolvió nada útil
        if (empty($dataset)) {
            $i = 1;
            foreach ($stops as $addr) {
                $dataset[] = ['order' => $i++, 'address' => $addr];
            }
        }

        // Persiste en cache_json con formato consistente
        $iaPayload = [
            'hoja_de_ruta' => null,
            'dataset'      => $dataset,
        ];

        $route->cache_json = json_encode($iaPayload, JSON_UNESCAPED_UNICODE);
        $route->ia_status  = 'completed';
        $route->save();

        return response()->success([
            'route' => $route,
            'ia'    => $iaPayload,
        ], 'Paradas ordenadas por IA.');
    }


    /**
     * GET /routes/{id}/ia-dataset
     * Devuelve SOLO el dataset ordenado por IA (sin hoja de ruta ni metadatos).
     */

    public function getItemsAll($route)
    {
        
        $origin      = (string) $route->origin_address;
        $destination = (string) $route->destination_address;

        $stops = [];
        foreach ($route->items as $it) {
            if (!empty($it->origin_address)) {
                $stops[] = $it->origin_address;
            }
        }
        
        if (empty($stops)) {
            return response()->success(['route' => $route], 'Sin paradas.');
        }

        $addressList = "- " . implode("\n- ", array_map('trim', $stops));

        
        $prompt2 = <<<EOT
    Actúa como experto en optimización de rutas.
    Ordena cronológicamente las PARADAS intermedias para un recorrido que inicia en:
    
    CONTEXTO DE RUTA:
    - INICIO (Punto A): {$origin}
    - FINAL (Punto B): {$destination}
    
    Reglas:
    - Usa únicamente las paradas listadas.
    - No incluyas ORIGEN ni DESTINO en el resultado.
    - No alteres el texto de las direcciones.
    - Devuelve EXCLUSIVAMENTE un JSON válido (sin texto adicional), con forma:
    [
    { "order": 1, "address": "..." },
    { "order": 2, "address": "..." }
    ]

    PARADAS (desordenadas):
    {$addressList}
    EOT;
    

    $prompt = <<<EOT
Actúa como experto en logística y optimización de rutas.
Tu tarea es ordenar las PARADAS intermedias de forma lógica para un conductor que viaja en California.

CONTEXTO DE RUTA:
- INICIO (Punto A): {$origin}
- FINAL (Punto B): {$destination}

- Devuelve EXCLUSIVAMENTE un JSON válido (sin texto adicional), con forma:
    [
    { "order": 1, "address": "..." },
    { "order": 2, "address": "..." }
    ]

Reglas:
1. Ordena las PARADAS basándote en la cercanía a la ruta lógica mencionada.
2. Usa únicamente las direcciones proporcionadas en la lista de abajo.
3. No incluyas el ORIGEN ni el DESTINO dentro del JSON.
4. Devuelve EXCLUSIVAMENTE un JSON válido.

PARADAS A ORDENAR:
{$addressList}
EOT;

        $apiKey     =   env('GEMINI_API_KEY');

        //p($apiKey);

        $url        =   $this->url;
        $dataset    =   [];
        try {
            // ✅ CORRECCIÓN DE TIMEOUT
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->timeout(350)->post($url, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);
            /**bUSCAME AQUI */
            //p($prompt2);
            if ($response->successful()) {
                //echo $response->json();exit;
                $raw = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                $clean = trim($raw);

                if ($clean !== '' && ($clean[0] ?? '') === '[') {
                    $dataset = json_decode($clean, true) ?? [];
                }

                if (empty($dataset) && preg_match('/\[\s*{[\s\S]*}\s*\]/', $raw, $m)) {
                    $dataset = json_decode($m[0], true) ?? [];
                }
            } else {
                //p($response->status());
                p($response->body()); // Aquí verás errores de API Key o cuotas
            }
            //p("fin");
        } catch (\Throwable $e) {
            // noop
        }

        //p($dataset);

        if (empty($dataset)) {
            $i = 1;
            foreach ($stops as $addr) {
                $dataset[] = ['order' => $i++, 'address' => $addr];
            }
        }

        
        // ---------- Enriquecimiento sin alterar la lógica anterior ----------
        // Índices por dirección para mapear metadatos originales del item
        $items = $route->items ?? collect();
        $itemsByAddr = $items->keyBy('origin_address');

        $normalize = static function (string $s): string {
            $s = mb_strtolower(trim($s));
            $s = preg_replace('/[^\p{L}\p{N}\s#,.:-]/u', '', $s);
            $s = preg_replace('/\s+usa?$/', '', $s);
            $s = preg_replace('/\s+california$/', '', $s);
            return preg_replace('/\s+/', ' ', $s);
        };

        $itemsByAddrNorm = [];
        foreach ($items as $it) {
            $k = $normalize((string)$it->origin_address);
            if ($k !== '') $itemsByAddrNorm[$k] = $it;
        }

        foreach ($dataset as &$row) {
            $addr = (string)($row['address'] ?? '');
            $item = $itemsByAddr->get($addr);

            if (!$item && $addr !== '') {
                $norm = $normalize($addr);
                if (isset($itemsByAddrNorm[$norm])) {
                    $item = $itemsByAddrNorm[$norm];
                }
            }

            // Incluir campos solicitados (preservando lat/lng/order/address existentes)
            $row['guide']               = $item->guide               ?? ($row['guide']               ?? null);
            $row['name']                = $item->name                ?? ($row['name']                ?? null);
            $row['phone']               = isset($item->phone) ? (string)$item->phone : ((string)($row['phone'] ?? ''));
            $row['origin_address']      = $item->origin_address      ?? ($row['origin_address']      ?? $addr);
            $row['destination_address'] = $item->destination_address ?? ($row['destination_address'] ?? '');
            $row['type']                = $item->type                ?? ($row['type']                ?? 'deliver');
        }
        unset($row);
        // -------------------------------------------------------------------

        //p($dataset);
        // Persistir opcionalmente
        //$route->cache_json = json_encode(['dataset' => $dataset], JSON_UNESCAPED_UNICODE);
        $route->cache_json      =   json_encode(['dataset' => $dataset]);
        $route->prompt          =   $prompt;
        $route->ia_status       =   'order1';
        $route->save();

        return response()->success(['dataset' => $dataset,"prompt"=>$prompt], 'OK');
    }

    public function getItemsAllX2($route)
    {
        $origin      = (string) $route->origin_address;
        $destination = (string) $route->destination_address;

        $stops = [];
        foreach ($route->items as $it) {
            if (!empty($it->origin_address)) {
                $stops[] = $it->origin_address;
            }
        }
        
        if (empty($stops)) {
            return response()->success(['route' => $route], 'Sin paradas.');
        }

        $addressList = "- " . implode("\n- ", array_map('trim', $stops));
        //p(70);
        $prompt = <<<EOT
    Actúa como experto en optimización de rutas.
    Ordena cronológicamente las PARADAS intermedias para un recorrido que inicia en:
    ORIGEN: {$origin}
    y finaliza en:
    DESTINO: {$destination}

    Reglas:
    - Usa únicamente las paradas listadas.
    - No incluyas ORIGEN ni DESTINO en el resultado.
    - No alteres el texto de las direcciones.
    - Devuelve EXCLUSIVAMENTE un JSON válido (sin texto adicional), con forma:
    [
    { "order": 1, "address": "..." },
    { "order": 2, "address": "..." }
    ]

    PARADAS (desordenadas):
    {$addressList}
    EOT;

        $apiKey = env('GEMINI_API_KEY');
        $url = $this->url;

        $dataset = [];
        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(300)
                ->post($url, [
                    'contents' => [[
                        'role'  => 'user',
                        'parts' => [['text' => $prompt]],
                    ]],
                ]);

            if ($response->successful()) {
                $raw = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                $clean = trim($raw);

                if ($clean !== '' && ($clean[0] ?? '') === '[') {
                    $dataset = json_decode($clean, true) ?? [];
                }

                if (empty($dataset) && preg_match('/\[\s*{[\s\S]*}\s*\]/', $raw, $m)) {
                    $dataset = json_decode($m[0], true) ?? [];
                }
                //p($dataset);
            }
        } catch (\Throwable $e) {
            //p(4);
            // noop
        }
        //p(5);
        if (empty($dataset)) {
            $i = 1;
            foreach ($stops as $addr) {
                $dataset[] = ['order' => $i++, 'address' => $addr];
            }
        }

        // Persistir opcionalmente
        $route->cache_json = json_encode(['dataset' => $dataset], JSON_UNESCAPED_UNICODE);
        $route->ia_status  = 'order1';
        $route->save();

        return response()->success(['dataset' => $dataset], 'OK');
    }


    
    /**
     * Enriquecer dataset IA con coordenadas basado en el item (id_direccion_item).
     * - Lee $route->cache_json->dataset
     * - Resuelve cada fila contra RouteItem por id o por dirección (normalizada)
     * - Usa lat/lng existentes; si faltan, geocodifica con Google y persiste en BD
     * - Actualiza $route->cache_json con lat/lng por cada fila
     */
    private function resolveItemsGoogleMapSINStatus($route)
    {
        // 0) Cargar y validar dataset
        $raw     = (string) ($route->cache_json ?? '');
        $decoded = json_decode($raw, true);
        $dataset = (is_array($decoded) && isset($decoded['dataset']) && is_array($decoded['dataset']))
            ? $decoded['dataset']
            : [];

        if (empty($dataset)) {
            return [];
        }

        if($route->ia_status==="order1"){
            // 1) API Key (usas GEMINI_API_KEY para Maps)
            $gmapsKey = env('GEMINI_API_KEY');
            if (!$gmapsKey) {
                return $dataset;
            }

            // 2) Asegurar relación items
            if (!($route->relationLoaded('items'))) {
                $route->loadMissing('items');
            }
            $items = $route->items ?? collect();

            // 3) Índices de búsqueda
            $itemsById   = $items->keyBy('id');
            $itemsByAddr = $items->keyBy('origin_address');

            $normalize = static function (string $s): string {
                $s = mb_strtolower(trim($s));
                $s = preg_replace('/[^\p{L}\p{N}\s#,.:-]/u', '', $s);
                $s = preg_replace('/\s+usa?$/', '', $s);
                $s = preg_replace('/\s+california$/', '', $s);
                return preg_replace('/\s+/', ' ', $s);
            };

            $itemsByAddrNorm = [];
            foreach ($items as $it) {
                $key = $normalize((string) $it->origin_address);
                if ($key !== '') {
                    $itemsByAddrNorm[$key] = $it;
                }
            }

            // 4) Geocodificación con caché y robustez
            $geocode = function (string $address) use ($gmapsKey) {
                $cacheKey = 'gmaps_geocode:' . md5('US|' . $address);

                return \Illuminate\Support\Facades\Cache::remember($cacheKey, now()->addDays(7), function () use ($address, $gmapsKey) {
                    $url    = 'https://maps.googleapis.com/maps/api/geocode/json';
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
                        $resp = \Illuminate\Support\Facades\Http::timeout(15)->get($url, $params);
                        if (!$resp->successful()) {
                            usleep($delayMs * 1000);
                            $delayMs *= 2;
                            continue;
                        }

                        $json   = $resp->json() ?: [];
                        $status = $json['status'] ?? 'UNKNOWN';

                        if ($status === 'OK') {
                            $results = $json['results'] ?? [];
                            if (empty($results)) {
                                return null;
                            }

                            // Preferir ROOFTOP
                            $pick = null;
                            foreach ($results as $r) {
                                if ((\Illuminate\Support\Arr::get($r, 'geometry.location_type') === 'ROOFTOP')) {
                                    $pick = $r;
                                    break;
                                }
                            }
                            if (!$pick) {
                                $pick = $results[0];
                            }

                            $loc = \Illuminate\Support\Arr::get($pick, 'geometry.location');
                            if (is_array($loc) && isset($loc['lat'], $loc['lng'])) {
                                return ['lat' => (float) $loc['lat'], 'lng' => (float) $loc['lng']];
                            }

                            // Fallback: centro del viewport
                            $vpNE = \Illuminate\Support\Arr::get($pick, 'geometry.viewport.northeast');
                            $vpSW = \Illuminate\Support\Arr::get($pick, 'geometry.viewport.southwest');
                            if (is_array($vpNE) && is_array($vpSW)
                                && isset($vpNE['lat'], $vpNE['lng'], $vpSW['lat'], $vpSW['lng'])) {
                                $lat = ((float) $vpNE['lat'] + (float) $vpSW['lat']) / 2.0;
                                $lng = ((float) $vpNE['lng'] + (float) $vpSW['lng']) / 2.0;
                                return ['lat' => $lat, 'lng' => $lng];
                            }

                            \Illuminate\Support\Facades\Log::warning('Geocode OK sin geometry', [
                                'address' => $address,
                                'first'   => $results[0]['formatted_address'] ?? null,
                            ]);
                            return null;
                        }

                        if (in_array($status, ['OVER_QUERY_LIMIT', 'RESOURCE_EXHAUSTED'], true)) {
                            usleep($delayMs * 1000);
                            $delayMs *= 2;
                            continue;
                        }

                        if ($status === 'ZERO_RESULTS') {
                            return null;
                        }

                        if (in_array($status, ['REQUEST_DENIED', 'INVALID_REQUEST'], true)) {
                            \Illuminate\Support\Facades\Log::error('Geocode denied/invalid', [
                                'address'       => $address,
                                'status'        => $status,
                                'error_message' => $json['error_message'] ?? null,
                            ]);
                            return null;
                        }

                        \Illuminate\Support\Facades\Log::warning('Geocode estado no OK', [
                            'address' => $address,
                            'status'  => $status,
                        ]);
                        usleep($delayMs * 1000);
                        $delayMs *= 2;
                    }

                    return null;
                });
            };

            //p($dataset);
            // 5) Procesar filas
            foreach ($dataset as $i => $row) {
                $itemId  = $row['id_direccion_item'] ?? null;
                $address = trim((string) ($row['address'] ?? ''));

                // Resolver item: id → address exacta → address normalizada
                $item = $itemId ? ($itemsById[$itemId] ?? null) : null;
                if (!$item && $address !== '') {
                    $item = $itemsByAddr[$address] ?? null;
                }
                if (!$item && $address !== '') {
                    $norm = $normalize($address);
                    if ($norm !== '' && isset($itemsByAddrNorm[$norm])) {
                        $item = $itemsByAddrNorm[$norm];
                    }
                }
                if (!$item) {
                    continue;
                }

                $resolvedAddress = (string) ($item->origin_address ?: $address);
                if ($resolvedAddress === '') {
                    continue;
                }

                // Si el item ya tiene coords válidas → propagar
                if (is_numeric($item->lat ?? null) && is_numeric($item->lng ?? null)) {
                    $dataset[$i]['lat'] = (float) $item->lat;
                    $dataset[$i]['lng'] = (float) $item->lng;
                    continue;
                }

                // Si la fila ya trae coords → persistir en item
                if (isset($row['lat'], $row['lng']) && is_numeric($row['lat']) && is_numeric($row['lng'])) {
                    \App\Models\RouteItem::whereKey($item->id)->update([
                        'lat'           => (float) $row['lat'],
                        'lng'           => (float) $row['lng'],
                        'geo_cached_at' => now(),
                    ]);
                    continue;
                }

                // Geocodificar
                $coords = $geocode($resolvedAddress);
                if ($coords) {
                    \App\Models\RouteItem::whereKey($item->id)->update([
                        'lat'           => $coords['lat'],
                        'lng'           => $coords['lng'],
                        'geo_cached_at' => now(),
                    ]);
                    $dataset[$i]['lat'] = $coords['lat'];
                    $dataset[$i]['lng'] = $coords['lng'];
                }
            }

            // 6) Persistir cache_json
            $route->cache_json  =   json_encode(['dataset' => $dataset], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
            $route->ia_status  = 'completed';
            $route->save();
        }

        $extra      =   [];
        $drivers    =   [];
        if (auth()->user()->hasRole('admin')) {
            $drivers = \App\Models\User::whereHas('roles', function ($q) {
                $q->where('name', 'employees');
            })->get();            
        }


        $items_evidence     =   [];

        foreach ($route->items as $key => $value) {
            $items_evidence[]=$value->evidence_urls;            
        }

        $newDataset         = [];
        $json_box_and_guide = $route->box_and_guide;
        

        $evidenceIndex = [];

        foreach ($items_evidence as $ev) {
            if (is_array($ev)) {
                foreach ($ev as $k => $files) {
                    if (is_array($files)) {
                        $evidenceIndex[$k] = $files;
                    }
                }
            }
        }

        foreach ($dataset as $key => $row) {
            
            $rowGuides = [];
            $row['json_box_and_guide'] = [];

            if (!empty($row['guide'])) {
                // Extraer solo las guías del dataset (antes del _)
                $rowGuides = array_map(
                    fn($g) => explode('_', trim($g))[0],
                    explode(',', $row['guide'])
                );
            }

            

            // Filtrar json_box_and_guide que correspondan a esas guías
            foreach ($json_box_and_guide as $bg) {
                if (in_array($bg['guide'], $rowGuides, true)) {

                    $keyEvidence = 'evidence_' . $bg['guide'] . $bg['box'];

                    $bg['evidences'] = $evidenceIndex[$keyEvidence] ?? [];

                    $row['json_box_and_guide'][] = $bg;
                }
            }



            $newDataset[] = $row;
        }

        //p($newDataset);
        // Resultado final en $newDataset


        return response()->success(array_merge([
                'route'     =>  $route,
                'ia'        =>  $dataset, // $iaData ahora contiene el dataset con 'id_direccion_item'
                'dataset'   =>  $newDataset,
                'drivers'   =>  $drivers
                
            ], []), 'Hoja de ruta SINStatus obtenida correctamente 2026. 20255555');

        //return response()->success(['dataset' => $dataset], 'OK');
    }


    private function resolveItemsGoogleMap($route)
    {
        // 0) Cargar y validar dataset
        $raw     = (string) ($route->cache_json ?? '');
        $decoded = json_decode($raw, true);
        $dataset = (is_array($decoded) && isset($decoded['dataset']) && is_array($decoded['dataset']))
            ? $decoded['dataset']
            : [];

        if (empty($dataset)) {
            return [];
        }

        if ($route->ia_status === "order1") {
            // 1) API Key (usas GEMINI_API_KEY para Maps)
            $gmapsKey = env('GEMINI_API_KEY');
            if (!$gmapsKey) {
                return $dataset;
            }

            // 2) Asegurar relación items
            if (!($route->relationLoaded('items'))) {
                $route->loadMissing('items');
            }
            $items = $route->items ?? collect();

            // 3) Índices de búsqueda
            $itemsById   = $items->keyBy('id');
            $itemsByAddr = $items->keyBy('origin_address');

            $normalize = static function (string $s): string {
                $s = mb_strtolower(trim($s));
                $s = preg_replace('/[^\p{L}\p{N}\s#,.:-]/u', '', $s);
                $s = preg_replace('/\s+usa?$/', '', $s);
                $s = preg_replace('/\s+california$/', '', $s);
                return preg_replace('/\s+/', ' ', $s);
            };

            $itemsByAddrNorm = [];
            foreach ($items as $it) {
                $key = $normalize((string) $it->origin_address);
                if ($key !== '') {
                    $itemsByAddrNorm[$key] = $it;
                }
            }

            // 4) Geocodificación
            $geocode = function (string $address) use ($gmapsKey) {
                $cacheKey = 'gmaps_geocode:' . md5('US|' . $address);

                return \Illuminate\Support\Facades\Cache::remember(
                    $cacheKey,
                    now()->addDays(7),
                    function () use ($address, $gmapsKey) {
                        $url    = 'https://maps.googleapis.com/maps/api/geocode/json';
                        $params = [
                            'address'    => $address,
                            'key'        => $gmapsKey,
                            'language'   => 'en',
                            'region'     => 'us',
                            'components' => 'country:US',
                        ];

                        $resp = \Illuminate\Support\Facades\Http::timeout(15)->get($url, $params);
                        if (!$resp->successful()) {
                            return null;
                        }

                        $json = $resp->json() ?: [];
                        if (($json['status'] ?? '') !== 'OK') {
                            return null;
                        }

                        $results = $json['results'] ?? [];
                        if (empty($results)) {
                            return null;
                        }

                        $loc = $results[0]['geometry']['location'] ?? null;
                        if (is_array($loc) && isset($loc['lat'], $loc['lng'])) {
                            return ['lat' => (float) $loc['lat'], 'lng' => (float) $loc['lng']];
                        }

                        return null;
                    }
                );
            };

            // 5) Procesar filas
            foreach ($dataset as $i => $row) {
                $itemId  = $row['id_direccion_item'] ?? null;
                $address = trim((string) ($row['address'] ?? ''));

                $item = $itemId ? ($itemsById[$itemId] ?? null) : null;
                if (!$item && $address !== '') {
                    $item = $itemsByAddr[$address] ?? null;
                }
                if (!$item && $address !== '') {
                    $norm = $normalize($address);
                    if ($norm !== '' && isset($itemsByAddrNorm[$norm])) {
                        $item = $itemsByAddrNorm[$norm];
                    }
                }
                if (!$item) {
                    continue;
                }

                if (is_numeric($item->lat ?? null) && is_numeric($item->lng ?? null)) {
                    $dataset[$i]['lat'] = (float) $item->lat;
                    $dataset[$i]['lng'] = (float) $item->lng;
                    continue;
                }

                if (isset($row['lat'], $row['lng']) && is_numeric($row['lat']) && is_numeric($row['lng'])) {
                    \App\Models\RouteItem::whereKey($item->id)->update([
                        'lat'           => (float) $row['lat'],
                        'lng'           => (float) $row['lng'],
                        'geo_cached_at' => now(),
                    ]);
                    continue;
                }

                $coords = $geocode((string) $item->origin_address);
                if ($coords) {
                    \App\Models\RouteItem::whereKey($item->id)->update([
                        'lat'           => $coords['lat'],
                        'lng'           => $coords['lng'],
                        'geo_cached_at' => now(),
                    ]);
                    $dataset[$i]['lat'] = $coords['lat'];
                    $dataset[$i]['lng'] = $coords['lng'];
                }
            }

            // 6) Persistir cache_json
            $route->cache_json = json_encode(
                ['dataset' => $dataset],
                JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
            );
            $route->ia_status = 'completed';
            $route->save();
        }

        $drivers = [];
        if (auth()->user()->hasRole('admin')) {
            $drivers = \App\Models\User::whereHas('roles', function ($q) {
                $q->where('name', 'employees');
            })->get();
        }

        // -------------------------
        // Evidencias
        // -------------------------
        $items_evidence = [];
        foreach ($route->items as $value) {
            $items_evidence[] = $value->evidence_urls;
        }

        $evidenceIndex = [];
        foreach ($items_evidence as $ev) {
            if (is_array($ev)) {
                foreach ($ev as $k => $files) {
                    if (is_array($files)) {
                        $evidenceIndex[$k] = $files;
                    }
                }
            }
        }

        // -------------------------
        // 🔹 NUEVO: index de status por guía+caja (json_status)
        // -------------------------
        $statusIndex = [];
        foreach ($route->items as $item) {
            if (is_array($item->json_status)) {
                foreach ($item->json_status as $k => $data) {
                    if (isset($data['status'])) {
                        $statusIndex[$k] = $data['status'];
                    }
                }
            }
        }

        // -------------------------
        // Armar dataset final
        // -------------------------
        $newDataset         = [];
        $json_box_and_guide = $route->box_and_guide;

        foreach ($dataset as $row) {
            $rowGuides = [];
            $row['json_box_and_guide'] = [];

            if (!empty($row['guide'])) {
                $rowGuides = array_map(
                    fn ($g) => explode('_', trim($g))[0],
                    explode(',', $row['guide'])
                );
            }

            foreach ($json_box_and_guide as $bg) {
                if (in_array($bg['guide'], $rowGuides, true)) {
                    $keyEvidence = 'evidence_' . $bg['guide'] . $bg['box'];
                    $keyStatus   = $bg['guide'] . '_' . $bg['box'];

                    $bg['evidences'] = $evidenceIndex[$keyEvidence] ?? [];
                    $bg['status']    = $statusIndex[$keyStatus] ?? 'Borrador';

                    $row['json_box_and_guide'][] = $bg;
                }
            }

            $newDataset[] = $row;
        }

        return response()->success([
            'route'   => $route,
            'ia'      => $dataset,
            'dataset' => $newDataset,
            'drivers' => $drivers,
        ], 'Hoja de ruta obtenida correctamente 2026. 20255555');
    }






    public function show_cache_fisico(string $id)
    {
        try {
            // Paso 1: Cargamos la ruta con sus items.
            $route = Routes::with('items','assignments')->find($id);

            if (!$route) {
                return response()->success([
                    'route'  => $route,
                ], 'Hoja de ruta vacía 1');
            }

            $iaData = []; // Inicializamos la variable de datos de la IA
            $addressListString = "";

            //p($route);

            if(empty($route->cache_json)){


                $extra = [];
                if (auth()->user()->hasRole('admin')) {
                    $drivers = \App\Models\User::whereHas('roles', function ($q) {
                        $q->where('name', 'employees');
                    })->get();
                    $extra['drivers'] = $drivers;
                }    
                return response()->success(array_merge([
                    'route' => $route, 
                                       
                ],$extra), 'Hoja de ruta obtenida correctamente 2026. Agua');
                
                return $this->getItemsAll($route);
            }else{
                $route->ia_status = 'completed';
                $route->save();

                /**
                 * Meter función externa aqui
                 */
                //$routes =   fetch_delivery_box_external();

                return response()->success(array_merge([
                    'route'     =>  $route                    
                ], []), 'Hoja de ruta Nueva');
                return $this->resolveItemsGoogleMap($route);
            }            

            // Paso 2: Verificamos si hay items en la ruta.
            if ($route->items->isNotEmpty()) {
                // Paso 3: Creamos clave de caché única.
                $itemsHash  =   rand(200,600).md5($route->items->pluck('id')->toJson());
                $cacheKey   =   "ia_9route_plan_for_route_{$route->id}_{$itemsHash}";
                
                // Para no usar cache, descomenta la siguiente línea
                // $cacheKey   =   rand(500, 96666) . "ia_9route_plan_for_route_{$route->id}_{$itemsHash}";

                // Paso 4: Usamos Cache::remember.
                $iaData = Cache::remember($cacheKey, now()->addHours(24), function () use ($route) {
                    // ... (TODO TU CÓDIGO PARA LLAMAR A GEMINI VA AQUÍ, SIN CAMBIOS)
                    // ...
                    // a. Preparamos la lista de direcciones para el prompt
                    $addresses = $route->items->pluck('origin_address')->toArray();
                    $addressList = "";
                    foreach ($addresses as $index => $address) {
                        $addressList .= ($index + 1) . ". " . $address . "\n";
                    }
                    $addressListString = $addressList;
                    
                    // b. Preparamos el prompt
                    $prompt = <<<EOT
                    Actúa como un asistente experto en logística y optimización de rutas. Tu tarea es crear una hoja de ruta eficiente para un conductor que debe recoger paquetes en varias ubicaciones.⚠️ No incluyas el origen ni el destino en la hoja de ruta ni en el dataset.

                    ### TAREA
                    1. Analiza la siguiente lista de direcciones de recogida.
                    2. Basado en un mapa (como Google Maps), determina el orden de visita más lógico y eficiente, empezando desde el punto de origen y terminando en el punto de destino.
                    3. Genera una "Hoja de Ruta" numerada y clara para el conductor.
                    4. Genera un "Dataset" en formato JSON válido con la lista de paradas en el orden correcto, incluyendo coordenadas geográficas estimadas (latitud y longitud).
                    5. No incluyas ningún punto de origen ni destino.

                    ### DATOS DE LA RUTA
                    - **Nombre de la Ruta:** {$route->name}
                    - **Punto de Origen:** {$route->origin_address}
                    - **Punto de Destino:** {$route->destination_address}
                    - **Direcciones de Recogida:**
                    {$addressList}
                    importante destacar que la ruta inicia en {$route->origin_address} pasa en este orden en California USA: Mendota -> Dos palos -> 
                    Los Baños -> Santa Cruz -> san josé -> San MAteo -> Fremont -> San Pablo -> Rodeo -> Dixon -> Sacramento

                    ### FORMATO DE SALIDA OBLIGATORIO
                    Proporciona la respuesta dividida en dos secciones EXACTAS, separadas por "---". No añadas ninguna otra explicación fuera de este formato.

                    ### Hoja de Ruta
                    [Aquí va la descripción paso a paso, numerada y fácil de leer para el conductor.]

                    ---
                    ### Dataset JSON
                    ```json
                    [
                    { "order": 1, "address": "Dirección completa de la parada 1", "lat": 36.7378, "lng": -119.7871 }
                    ]
                    ```
                    EOT;
                    
                    $apiKey = env('GEMINI_API_KEY');
                    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
                    $response = Http::timeout(350)->post($url, [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $prompt]
                                ]
                            ]
                        ]
                    ]);

                    $routePlan = null;
                    $dataset = [];
                    
                    // d. Procesamos la respuesta
                    if ($response->successful()) {
                        $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');
                        if ($generatedText) {
                            $parts = explode('---', $generatedText, 2);
                            $routePlanText = $parts[0] ?? '';
                            $routePlan = trim(str_replace('### Hoja de Ruta', '', $routePlanText));

                            if (isset($parts[1])) {
                                if (preg_match('/```json\s*([\s\S]*?)\s*```/', $parts[1], $matches)) {
                                    $dataset = json_decode($matches[1], true) ?? [];
                                }
                            }
                        }
                        $route->update(['ia_status' => 'completed']);
                    } else {
                        $routePlan = "No se pudo generar la hoja de ruta. Error de la API: " . $response->body();
                    }

                    // e. Devolvemos el array que se guardará en la caché.
                    return [
                        'hoja_de_ruta' => $routePlan,
                        'dataset'      => $dataset,
                        'addressListString' => $addressListString
                    ];
                });

                // --- INICIO: CÓDIGO PARA AÑADIR ID DEL ITEM ---
                
                // Verificamos que tengamos un dataset con el que trabajar.
                /*
                if (!empty($iaData['dataset'])) {

                    // Función para normalizar direcciones (minúsculas, sin puntuación, etc.)
                    // Esto hace que la comparación sea más fiable.
                    $normalizeAddress = function ($address) {
                        $address = strtolower($address);
                        // Elimina comas, puntos y la palabra 'usa' al final.
                        $address = str_replace([',', '.'], '', $address);
                        $address = preg_replace('/\s+usa$/', '', $address);
                        // Reemplaza múltiples espacios por uno solo.
                        return trim(preg_replace('/\s+/', ' ', $address));
                    };

                    // 1. Creamos el mapa de búsqueda a partir de los items originales.
                    //    La clave es la dirección normalizada, el valor es un array de IDs (para manejar duplicados).
                    $addressToIdMap = [];
                    foreach ($route->items as $item) {
                        $normalized = $normalizeAddress($item->origin_address);
                        $addressToIdMap[$normalized][] = $item->id;
                    }

                    // 2. Recorremos el dataset de la IA para enriquecerlo.
                    $augmentedDataset = $iaData['dataset'];
                    foreach ($augmentedDataset as $key => &$iaItem) { // Usamos '&' para modificar el array directamente.
                        $normalizedIaAddress = $normalizeAddress($iaItem['address']);
                        
                        // 3. Buscamos la dirección en nuestro mapa.
                        if (isset($addressToIdMap[$normalizedIaAddress]) && !empty($addressToIdMap[$normalizedIaAddress])) {
                            // Usamos array_shift para obtener el primer ID y eliminarlo del array.
                            // Esto asegura que si hay direcciones duplicadas, se asignen los IDs correctos en orden.
                            $iaItem['id_direccion_item'] = array_shift($addressToIdMap[$normalizedIaAddress]);
                        } else {
                            // Si no se encuentra una coincidencia (poco probable), asignamos null.
                            $iaItem['id_direccion_item'] = null;
                        }
                    }
                    unset($iaItem); // Rompemos la referencia del bucle foreach.

                    // 4. Reemplazamos el dataset original de la IA con nuestro dataset enriquecido.
                    $iaData['dataset'] = $augmentedDataset;
                }
                    */
                // --- FIN: CÓDIGO PARA AÑADIR ID DEL ITEM ---

                if (!empty($iaData['dataset'])) {

                    // 1. Función de normalización más robusta.
                    //    Esto limpia las cadenas antes de compararlas para obtener mejores resultados.
                    $normalizeAddress = function ($address) {
                        $address = strtolower($address);
                        // Reemplaza abreviaturas comunes y elimina puntuación no deseada.
                        $replacements = [
                            ' apt ' => ' apartment ', ' ave ' => ' avenue ', ' st ' => ' street ',
                            ' ln ' => ' lane ', ' dr ' => ' drive ', ' ct ' => ' court ',
                            ' cal ' => ' ca ', ' usa' => ''
                        ];
                        // Añadimos espacios para no reemplazar partes de palabras (ej: 'st' en 'street')
                        $address = str_replace(array_keys($replacements), array_values($replacements), " $address ");
                        // Elimina toda la puntuación
                        $address = preg_replace('/[^\p{L}\p{N}\s]/u', '', $address);
                        return trim(preg_replace('/\s+/', ' ', $address));
                    };

                    // 2. Preparamos una lista de los items originales para poder "consumirlos".
                    //    Usamos keyBy('id') para poder eliminar items fácilmente una vez que los asignamos.
                    $availableItems     =   $route->items->keyBy('id')->all();
                    $availableItems2    =   $route->items->keyBy('origin_address')->all();
                    // 3. Recorremos el dataset de la IA para enriquecerlo.
                    $augmentedDataset = $iaData['dataset'];
                    foreach ($augmentedDataset as &$iaItem) { // Usamos '&' para modificar el array directamente.
                        $iaItem['id_direccion_item'] = null; // Valor por defecto
                        $bestMatchId = null;
                        $highestSimilarity = 0;
                        // Umbral de confianza: solo aceptaremos una coincidencia si es al menos 85% similar.
                        $similarityThreshold = 85; 

                        $normalizedIaAddress = $normalizeAddress($iaItem['address']);

                        // 4. Comparamos la dirección de la IA con CADA dirección disponible en la BD.
                        foreach ($availableItems as $itemId => $dbItem) {
                            $normalizedDbAddress = $normalizeAddress($dbItem->origin_address);
                            
                            // Calculamos el porcentaje de similitud.
                            similar_text($normalizedIaAddress, $normalizedDbAddress, $percent);

                            // Si esta es la mejor coincidencia que hemos encontrado hasta ahora, la guardamos.
                            if ($percent > $highestSimilarity) {
                                
                                $highestSimilarity  =   $percent;
                                $bestMatchId        =   $itemId;                                
                            }
                        }

                        // 5. Si la mejor coincidencia que encontramos supera nuestro umbral...
                        if ($highestSimilarity >= $similarityThreshold) {

                            $routeItem2025      =   RouteItem::where('id', $bestMatchId)->first();
                            // ...la asignamos...
                            $iaItem['id_direccion_item']        = $bestMatchId;
                            $iaItem['origen_real']              = $routeItem2025->origin_address;
                            // ...¡y la eliminamos de la lista de items disponibles!
                            // Esto es CRUCIAL para manejar direcciones duplicadas correctamente.
                            unset($availableItems[$bestMatchId]);
                        }
                    }
                    unset($iaItem); // Rompemos la referencia.

                    // 6. Reemplazamos el dataset original de la IA con nuestro dataset enriquecido.
                    $iaData['dataset'] = $augmentedDataset;
                }
            }

            // Paso 5: Devolvemos la respuesta final con los datos de la IA ya enriquecidos.
            $extra = [];
            if (auth()->user()->hasRole('admin')) {
                $drivers = \App\Models\User::whereHas('roles', function ($q) {
                    $q->where('name', 'employees');
                })->get();
                $extra['drivers'] = $drivers;
            }

            $route->cache_json = json_encode($iaData, JSON_UNESCAPED_UNICODE);
            $route->save();

            return response()->success(array_merge([
                'route' => $route,
                'ia'    => $iaData, // $iaData ahora contiene el dataset con 'id_direccion_item'
                'addressListString' => $addressListString
            ], $extra), 'Hoja de ruta obtenida correctamente 2026. Agua');

        } catch (\Throwable $e) {
            // Atrapa cualquier error inesperado
            return response()->error($e->getMessage(), 500);
        }
    }



    public function show_Funciona_pero_no_relaciona(string $id)
    {

        try {
            // Paso 1: Usamos findOrFail para cargar la ruta con sus items.
            // Esto es más limpio: si no encuentra la ruta, irá directamente al bloque catch.
            $route = Routes::with('items')->find($id);
            //p($route);

            if (!$route) {
                return response()->success([
                    'route'   => $route,
                ], 'Hoja de ruta vacía 1');
            }

            $iaData = []; // Inicializamos la variable de datos de la IA
            $addressListString = "";

            // Paso 2: Verificamos si hay items en la ruta.
            if ($route->items->isNotEmpty()) {

                // Paso 3: Creamos una clave de caché única para esta ruta específica y su estado actual de items.
                // Si añades o quitas un item, el hash cambiará y la caché se regenerará automáticamente.
                $itemsHash  =   md5($route->items->pluck('id')->toJson());
                $cacheKey   =   "ia_9route_plan_for_route_{$route->id}_{$itemsHash}";
                /**Para no usar cache  */
                //$cacheKey   =   rand(500, 96666) . "ia_9route_plan_for_route_{$route->id}_{$itemsHash}";
                // Paso 4: Usamos Cache::remember.
                // Laravel buscará la clave. Si no la encuentra, ejecutará el código dentro de la función,
                // guardará el resultado en la caché por 24 horas y lo devolverá.
                // En las siguientes peticiones, devolverá el resultado guardado al instante.

                $iaData = Cache::remember($cacheKey, now()->addHours(24), function () use ($route) {

                    // --- ESTE CÓDIGO SOLO SE EJECUTARÁ SI LA RUTA NO ESTÁ EN CACHÉ ---

                    // a. Preparamos la lista de direcciones para el prompt
                    $addresses = $route->items->pluck('origin_address')->toArray();

                    $addressList = "";
                    foreach ($addresses as $index => $address) {
                        $addressList .= ($index + 1) . ". " . $address . "\n";
                    }

                    $addressListString = $addressList;

                    // b. Preparamos el prompt
                    $prompt = <<<EOT
                    Actúa como un asistente experto en logística y optimización de rutas. Tu tarea es crear una hoja de ruta eficiente para un conductor que debe recoger paquetes en varias ubicaciones.⚠️ No incluyas el origen ni el destino en la hoja de ruta ni en el dataset.

                    ### TAREA
                    1. Analiza la siguiente lista de direcciones de recogida.
                    2. Basado en un mapa (como Google Maps), determina el orden de visita más lógico y eficiente, empezando desde el punto de origen y terminando en el punto de destino.
                    3. Genera una "Hoja de Ruta" numerada y clara para el conductor.
                    4. Genera un "Dataset" en formato JSON válido con la lista de paradas en el orden correcto, incluyendo coordenadas geográficas estimadas (latitud y longitud).
                    5. No incluyas ningún punto de origen ni destino.

                    ### DATOS DE LA RUTA
                    - **Nombre de la Ruta:** {$route->name}
                    - **Punto de Origen:** {$route->origin_address}
                    - **Punto de Destino:** {$route->destination_address}
                    - **Direcciones de Recogida:**
                    {$addressList}

                    ### FORMATO DE SALIDA OBLIGATORIO
                    Proporciona la respuesta dividida en dos secciones EXACTAS, separadas por "---". No añadas ninguna otra explicación fuera de este formato.

                    ### Hoja de Ruta
                    [Aquí va la descripción paso a paso, numerada y fácil de leer para el conductor.]

                    ---
                    ### Dataset JSON
                    ```json
                    [
                      { "order": 1, "address": "Dirección completa de la parada 1", "lat": 36.7378, "lng": -119.7871 }
                    ]
                    ```
                    EOT;

                    $apiKey = env('GEMINI_API_KEY');

                    // ✅ CORRECCIÓN DE URL
                    $url = $this->url;

                    // ✅ CORRECCIÓN DE TIMEOUT
                    $response = Http::timeout(350)->post($url, [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $prompt]
                                ]
                            ]
                        ]
                    ]);

                    $routePlan = null;
                    $dataset = [];

                    // d. Procesamos la respuesta
                    if ($response->successful()) {
                        $generatedText = data_get($response->json(), 'candidates.0.content.parts.0.text');
                        if ($generatedText) {
                            $parts = explode('---', $generatedText, 2);
                            $routePlanText = $parts[0] ?? '';
                            $routePlan = trim(str_replace('### Hoja de Ruta', '', $routePlanText));

                            if (isset($parts[1])) {
                                if (preg_match('/```json\s*([\s\S]*?)\s*```/', $parts[1], $matches)) {
                                    $dataset = json_decode($matches[1], true) ?? [];
                                }
                            }
                        }
                    } else {
                        $routePlan = "No se pudo generar la hoja de ruta. Error de la API: " . $response->body();
                    }

                    // e. Devolvemos el array que se guardará en la caché.
                    return [
                        'hoja_de_ruta' => $routePlan,
                        'dataset'      => $dataset,
                        'addressListString' => $addressListString
                    ];
                });
            }



            // Paso 5: Devolvemos la respuesta final con los datos de la IA (obtenidos de la caché o recién generados).
            $extra = [];
            if (auth()->user()->hasRole('admin')) {
                $drivers = \App\Models\User::whereHas('roles', function ($q) {
                    $q->where('name', 'employees');
                })->get();
                $extra['drivers'] = $drivers;
            }

            return response()->success(array_merge([
                'route' => $route,
                'ia'    => $iaData,
                'addressListString' => $addressListString
            ], $extra), 'Hoja de ruta obtenida correctamente 2026.');
        } catch (ModelNotFoundException $e) {
            // Se ejecuta si findOrFail no encuentra la ruta
            return response()->error('La ruta solicitada no fue encontrada.', 404);
        } catch (\Throwable $e) {
            // Atrapa cualquier otro error inesperado
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * PUT /routes/{id}
     * Actualizar una ruta existente con sus items y persistir el cache de la IA
     */
    public function update(Request $request, string $id)
{
    DB::beginTransaction();

    try {
        $validated = $request->validate([
            'cache_json'            => 'nullable|array',
            'ia_status'             => 'nullable|string',
            'name'                  => 'nullable|string|max:255',
            'phone'                 => 'required|string|max:20',
            'origin_address'        => 'required|string|max:255',
            'destination_address'   => 'nullable|string|max:255',
            'type'                  => 'required|in:deliver,pickup',
            'date'                  => 'nullable|date',
        ]);

        $route = Routes::findOrFail($id);

        /* =========================================================
           1. Datos maestros
        ========================================================= */
        $cacheData = $request->input('cache_json');

        if (is_array($cacheData)) {
            $route->cache_json = json_encode($cacheData, JSON_UNESCAPED_UNICODE);
        }

        $route->fill($validated);
        $route->ia_status = $request->input('ia_status', 'completed');
        $route->save();

        /* =========================================================
           2. Items y asignaciones
        ========================================================= */
        if (is_array($cacheData) && count($cacheData) > 0) {

            \App\Models\RouteItem::where('route_id', $route->id)->delete();
            \App\Models\RouteAssignment::where('route_id', $route->id)->delete();

            foreach ($cacheData as $row) {

                $guideBase = $row['guideNumber'] ?? ($row['guide'] ?? null);

                \App\Models\RouteItem::create([
                    'route_id'            => $route->id,
                    'guide'               => $guideBase,
                    'json_dataset'        => json_encode($row, JSON_UNESCAPED_UNICODE),
                    'name'                => $row['name'] ?? 'Movex Cliente',
                    'phone'               => $row['phone'] ?? ($row['phone_sender'] ?? null),
                    'origin_address'      => $row['address'] ?? ($row['origin_address'] ?? null),
                    'destination_address' => $row['destination_address'] ?? null,
                    'observation'         => $row['observation'] ?? '',
                    'type'                => $row['type'] ?? 'pickup',
                    'status'              => $row['status'] ?? 'Agendado',
                    'lat'                 => isset($row['lat']) ? (float) $row['lat'] : null,
                    'lng'                 => isset($row['lng']) ? (float) $row['lng'] : null,
                    'day'                 => $row['day'] ?? ($row['pickup_day'] ?? 1),
                    'guide_remote'        => $row['guide_items'] ?? null,
                ]);

                if ($guideBase && !empty($row['guide_items'])) {
                    $guides2 = explode(',', $row['guide_items']);

                    foreach ($guides2 as $guide2) {
                        \App\Models\RouteAssignment::updateOrCreate(
                            [
                                'route_id' => $route->id,
                                'guide'    => $guideBase,
                                'guide2'   => trim($guide2),
                            ],
                            [
                                'route_id' => $route->id,
                                'guide'    => $guideBase,
                                'guide2'   => trim($guide2),
                            ]
                        );
                    }
                }
            }
        }

        DB::commit();

        $route->load('items');

        return response()->success(
            compact('route'),
            'Ruta, Items y Asignaciones actualizadas correctamente.'
        );

    } catch (\Throwable $e) {
        DB::rollBack();
        \Log::error('RouteUpdate error: ' . $e->getMessage());

        return response()->error(
            'No se pudo guardar: ' . $e->getMessage(),
            500
        );
    }
}

    public function updateXXXX(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'cache_json'            => 'nullable|array',
                'ia_status'             => 'nullable|string',
                'name'                  => 'nullable|string|max:255',
                'phone'                 => 'required|string|max:20',
                'origin_address'        => 'required|string|max:255',
                'destination_address'   => 'nullable|string|max:255',
                'type'                  => 'required|in:deliver,pickup',
                'date'                  => 'nullable|date',
            ]);

            //p( $request->all());    

            $route = Routes::findOrFail($id);

            // 1. Datos maestros
            $cacheData = $request->input('cache_json');
            if ($cacheData) {
                $route->cache_json = json_encode($cacheData, JSON_UNESCAPED_UNICODE);
            }

            $route->fill($validated);
            $route->ia_status = $request->input('ia_status', 'completed');
            $route->save();

            // 2. Items y asignaciones
            if (is_array($cacheData) && count($cacheData) > 0) {

                \App\Models\RouteItem::where('route_id', $route->id)->delete();
                \App\Models\RouteAssignment::where('route_id', $route->id)->delete();

                foreach ($cacheData as $row) {
                    /*
                    p($route);    
                    if($row["id"]=="1352"){
                        
                    }
                    */
                    

                    $guideBase = $row['guideNumber'] ?? ($row['guide'] ?? null);

                    \App\Models\RouteItem::create([
                        'route_id'            => $route->id,
                        'guide'               => $guideBase,
                        'json_dataset'        =>    $row,
                        'name'                =>    $row['name'] ?? 'Movex Cliente',
                        'phone'               =>    $row['phone'] ?? ($row['phone_sender'] ?? null),
                        'origin_address'      =>    $row['address'] ?? ($row['origin_address'] ?? null),
                        'destination_address' =>    $row['destination_address'] ?? null,
                        'observation'         =>    $row['observation'] ?? '',
                        'type'                =>    $row['type'] ?? 'pickup',
                        'status'              =>    $row['status'] ?? 'Agendado',
                        'lat'                 =>    isset($row['lat']) ? (float) $row['lat'] : null,
                        'lng'                 =>    isset($row['lng']) ? (float) $row['lng'] : null,
                        'day'                 =>    $row['day'] ?? ($row['pickup_day'] ?? 1),
                        'guide_remote'        =>    $row['guide_items'] ?? null,
                    ]);

                    // RouteAssignment (guide / guide2)
                    if ($guideBase && !empty($row['guide_items'])) {
                        $guides2 = explode(',', $row['guide_items']);

                        foreach ($guides2 as $guide2) {
                            \App\Models\RouteAssignment::updateOrCreate(
                                [
                                    'route_id' => $route->id,
                                    'guide'    => $guideBase,
                                    'guide2'   => trim($guide2),
                                ],
                                [
                                    'route_id' => $route->id,
                                    'guide'    => $guideBase,
                                    'guide2'   => trim($guide2),
                                ]
                            );
                        }
                    }
                }
            }

            DB::commit();

            $route->load('items');

            return response()->success(
                compact('route'),
                'Ruta, Items y Asignaciones actualizadas correctamente.'
            );

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('RouteUpdate error: ' . $e->getMessage());
            return response()->error(
                'No se pudo guardar: ' . $e->getMessage(),
                500
            );
        }
    }




    public function updateOLD(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'user_id'               => 'nullable|exists:users,id',
                'employees_id'          => 'nullable|exists:users,id',
                'name'                  => 'nullable|string|max:255',
                'phone'                 => 'required|string|max:20',
                'origin_address'        => 'required|string|max:255',
                'destination_address'   => 'nullable|string|max:255',
                'type'                  => 'required|in:deliver,pickup',
                'date'                  => 'nullable|date',
                'items'                 => 'nullable|array',
                'items.*.name'                  => 'nullable|string|max:255',
                'items.*.guide'                 => 'nullable|string|max:255',
                'items.*.phone'                 => 'required_with:items|string|max:20',
                'items.*.origin_address'        => 'required_with:items|string|max:255',
                'items.*.destination_address'   => 'nullable:items|string|max:255',
                'items.*.type'                  => 'required_with:items|in:deliver,pickup',
                'items.*.status'                => 'nullable|string|in:Borrador,Agendado,En proceso,Rechazado,Cancelado',
            ]);

            $route = Routes::findOrFail($id);

            $items_old  =   [];

            foreach ($route->items as $key => $value) {
                $items_old[$value->origin_address]=$value;                
            }
            

            $route->update($validated);

            if (isset($validated['items'])) {
                $route->items()->delete();

                foreach ($validated['items'] as $item) {
                    if(!empty($items_old[$item["origin_address"]])){
                        $route->items()->create($items_old[$item["origin_address"]]->toArray());
                    }
                }
            }

            DB::commit();
            return response()->success(compact('route'), 'Ruta actualizada correctamente con items.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * DELETE /routes/{id}
     * Eliminar una ruta
     */
    public function destroy(string $id)
    {
        try {
            $route = Routes::findOrFail($id);
            $route->delete();

            return response()->success(null, 'Ruta eliminada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Actualiza el estado de todos los items de una ruta que coincidan con una dirección de origen.
     */
    public function setStatusAddress(Request $request, string $id)
    {

        // 🛡️ 1. Validar los datos que llegan en el request.
        $validator = Validator::make($request->all(), [
            'direction' => 'required|string|max:255',
            'status'    => 'required|string|in:accept,reject,cancel', // Añade los estados que el frontend enviará
        ]);

        if ($validator->fails()) {
            return response()->error('Datos de entrada inválidos.', 422, $validator->errors());
        }
        try {
            $routeItem      =   RouteItem::where('id', $request->route_items)->first();


            // 2. Encontrar la ruta usando el $id. Si no existe, lanzará una excepción.
            Routes::findOrFail($routeItem->route_id);


            // ⚙️ 3. Mapear el estado del payload a los estados de la base de datos.
            //    Esto da flexibilidad para que el frontend y el backend usen términos diferentes.
            $statusMap = [
                'accept' => 'Agendado',
                'reject' => 'Rechazado',
                'cancel' => 'Cancelado',
            ];

            $newDbStatus = $statusMap[$request->status];

            //p([$request->all(),$id]);

            // 💡 4. Actualizar el estado de TODOS los items que coincidan.
            //    Esta es la forma más eficiente. Se ejecuta una sola consulta a la base de datos
            //    en lugar de iterar sobre una colección en PHP.

            $updatedCount   =   RouteItem::where('id', $request->route_items)->update(['status' => $newDbStatus]);
            //p($updatedCount);
            //p($routeItem->route_id);

            if ($updatedCount > 0) {
                $message = "Se actualizaron {$updatedCount} paradas a estado '{$newDbStatus}'.";
            } else {
                $message = "No se encontraron paradas que coincidieran con la dirección proporcionada en esta ruta.";
            }

            $route          =   Routes::findOrFail($routeItem->route_id);
            $item           =   RouteItem::where('route_id', $routeItem->route_id)->first();

            // 📤 5. Devolver una respuesta exitosa y significativa.
            return response()->success(['updated_count' => $updatedCount, "item" => $item, "items" => $route->items], $message);
        } catch (ModelNotFoundException $e) {
            return response()->error('La ruta especificada no fue encontrada.', 404);
        } catch (\Throwable $e) {
            // Capturar cualquier otro error inesperado
            return response()->error('Ocurrió un error en el servidor: ' . $e->getMessage(), 500);
        }
    }


     /**
     * PUT /routes/{id}/reorder
     */
    public function reorder(Request $request, $id)
    {

        //p(50);
        $route = Routes::findOrFail($id);

        $validated = $request->validate([
            'routes' => 'required|array',
            'routes.*.order' => 'required|integer',
            'routes.*.address' => 'required|string',
            'routes.*.lat' => 'required|numeric',
            'routes.*.lng' => 'required|numeric',

            // Campos opcionales pero existentes en el payload
            'routes.*.guide' => 'nullable|string',
            'routes.*.name'  => 'nullable|string',
            'routes.*.phone' => 'nullable|string',
            'routes.*.origin_address' => 'nullable|string',
            'routes.*.destination_address' => 'nullable|string',
            'routes.*.type' => 'nullable|string|in:deliver,pickup',

            'routes.*.id_direccion_item' => 'nullable|integer',
        ]);


        $cache = $route->cache_json ? json_decode($route->cache_json, true) : [];
        if (!is_array($cache)) {
            $cache = [];
        }

        $cache['dataset'] = $validated['routes'];

        $route->cache_json = json_encode($cache, JSON_UNESCAPED_UNICODE);
        $route->save();

        return response()->success([
            'route'  => $route,
            'ia'     => $cache,
            'routes' => $validated['routes'],
        ], 'Orden de la ruta actualizado correctamente');
    }


    public function setStatusAddressByItems(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
        'route_items' => 'required|integer|exists:route_items,id',
        'status'      => 'required|string|in:accept,reject,cancel',
        'row'         => 'required|string',
        ]);

        if ($validator->fails()) {
        return response()->error('Datos inválidos.', 422, $validator->errors());
        }

        try {
        $item = RouteItem::findOrFail($request->route_items);

        $statusMap = [
            'accept' => 'Agendado',
            'reject' => 'Rechazado',
            'cancel' => 'Cancelado',
        ];

        $dbStatus = $statusMap[$request->status];

        // 🔑 key estable: guia BD + caja
        $key = $item->guide . '_' . $request->row;

        $jsonStatus = is_array($item->json_status) ? $item->json_status : [];

        $jsonStatus[$key] = [
            'status'     => $dbStatus,
            'updated_at' => now()->toDateTimeString(),
        ];

        //p($jsonStatus,false);

        $item->json_status = $jsonStatus;
        $item->save();

        return response()->success([
            'route_item_id' => $item->id,
            'json_status'   => $jsonStatus,
        ], 'Estado actualizado correctamente por item.');

        } catch (ModelNotFoundException $e) {
        return response()->error('Item no encontrado.', 404);
        } catch (\Throwable $e) {
        return response()->error('Error interno: ' . $e->getMessage(), 500);
        }
    }





    public function setStatusAddressByItemsAntes(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'route_items'      => 'required|integer|exists:route_items,id',
            'status'           => 'required|string|in:accept,reject,cancel',
            'row.guide'        => 'required|string',
            'row.box'          => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->error('Datos inválidos.', 422, $validator->errors());
        }

        try {
            /** @var RouteItem $item */
            $item = RouteItem::findOrFail($request->route_items);

            // Mapeo frontend → BD
            $statusMap = [
                'accept' => 'Agendado',
                'reject' => 'Rechazado',
                'cancel' => 'Cancelado',
            ];

            $dbStatus = $statusMap[$request->status];

            // Clave única por guía + caja
            $key = $request->row['guide'] . '_' . $request->row['box'];

            // Cargar json_status existente
            $jsonStatus = is_array($item->json_status) ? $item->json_status : [];

            // Actualizar SOLO esta caja
            $jsonStatus[$key] = [
                'status'     => $dbStatus,
                'updated_at' => now()->toDateTimeString(),
            ];

            // Persistir
            $item->json_status = $jsonStatus;
            $item->save();

            return response()->success([
                'route_item_id' => $item->id,
                'json_status'   => $jsonStatus,
            ], 'Estado actualizado correctamente por item.');

        } catch (ModelNotFoundException $e) {
            return response()->error('Item no encontrado.', 404);
        } catch (\Throwable $e) {
            return response()->error('Error interno: ' . $e->getMessage(), 500);
        }
    }

    
    public function setIaManualV2(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'prompt'   => 'required|string',
            'manualIa'=> 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->error($validator->errors()->first(), 422);
        }

        $route = Routes::with('items')->findOrFail($id);

        $decodedManualIa = json_decode($request->input('manualIa'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->error('manualIa no es un JSON válido', 422);
        }

        $route->update([
            'prompt'     => $request->input('prompt'),
            'cache_json' => $decodedManualIa,
        ]);

        return response()->success(
            $route->only(['id', 'prompt', 'cache_json']),
            'IA manual actualizada'
        );
    }



    public function setIaManual(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'prompt' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->error('Prompt inválido.', 422, $validator->errors());
        }

        try {
            /** @var Routes $route */
            $route = Routes::with('items')->findOrFail($id);

            // 1️⃣ Parsear JSON manual
            $rawPrompt = trim($request->prompt);
            $decoded   = json_decode($rawPrompt, true);

            if (!is_array($decoded)) {
                return response()->error('El contenido no es un JSON válido.', 422);
            }

            // 2️⃣ Normalización de Estructura (Extraer array si viene envuelto)
            // Soporta: { "paradas_ordenadas": [...] } o { "dataset": [...] } o [...]
            $dataset = $decoded;
            if (isset($decoded['paradas_ordenadas'])) {
                $dataset = $decoded['paradas_ordenadas'];
            } elseif (isset($decoded['dataset'])) {
                $dataset = $decoded['dataset'];
            }

            // 3️⃣ Validar y Normalizar llaves de cada fila
            foreach ($dataset as &$row) {
                // Homologar "orden" -> "order"
                if (isset($row['orden']) && !isset($row['order'])) {
                    $row['order'] = $row['orden'];
                }
                // Homologar "direccion" -> "address"
                if (isset($row['direccion']) && !isset($row['address'])) {
                    $row['address'] = $row['direccion'];
                }

                // Validar que ahora sí existan las llaves requeridas
                if (!isset($row['order'], $row['address'])) {
                    return response()->error(
                        'Cada fila debe contener "order" (o "orden") y "address" (o "direccion").',
                        422
                    );
                }
            }
            unset($row); // Limpiar referencia del loop

            // 4️⃣ Reutilizar enriquecimiento EXACTO de getItemsAll()
            $items       = $route->items ?? collect();
            $itemsByAddr = $items->keyBy('origin_address');

            $normalize = static function (string $s): string {
                $s = mb_strtolower(trim($s));
                $s = preg_replace('/[^\p{L}\p{N}\s#,.:-]/u', '', $s);
                $s = preg_replace('/\s+usa?$/', '', $s);
                $s = preg_replace('/\s+california$/', '', $s);
                return preg_replace('/\s+/', ' ', $s);
            };

            $itemsByAddrNorm = [];
            foreach ($items as $it) {
                $k = $normalize((string) $it->origin_address);
                if ($k !== '') {
                    $itemsByAddrNorm[$k] = $it;
                }
            }

            foreach ($dataset as &$row) {
                $addr = (string) ($row['address'] ?? '');
                $item = $itemsByAddr->get($addr);

                if (!$item && $addr !== '') {
                    $norm = $normalize($addr);
                    if (isset($itemsByAddrNorm[$norm])) {
                        $item = $itemsByAddrNorm[$norm];
                    }
                }

                // Enriquecer el dataset con la info real de la base de datos de Ivoolve
                $row['guide']               = $item->guide                ?? null;
                $row['name']                = $item->name                 ?? null;
                $row['phone']               = isset($item->phone) ? (string) $item->phone : '';
                $row['origin_address']      = $item->origin_address       ?? $addr;
                $row['destination_address'] = $item->destination_address  ?? '';
                $row['type']                = $item->type                 ?? 'deliver';
            }
            unset($row);

            // 5️⃣ Persistir resultado manual
            $route->cache_json = json_encode(
                ['dataset' => $dataset],
                JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
            );
            $route->prompt    = $rawPrompt;
            $route->ia_status = 'order1';
            $route->save();

            // 6️⃣ Resolver coordenadas (flujo normal de Google Maps)
            return $this->resolveItemsGoogleMap($route);

        } catch (ModelNotFoundException $e) {
            return response()->error('Ruta no encontrada.', 404);
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function setIaManualOLD(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'prompt' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->error('Prompt inválido.', 422, $validator->errors());
        }

        try {
            /** @var Routes $route */
            $route = Routes::with('items')->findOrFail($id);

            // 1️⃣ Parsear JSON manual
            $rawPrompt = trim($request->prompt);
            $dataset   = json_decode($rawPrompt, true);

            if (!is_array($dataset)) {
                return response()->error('El contenido no es un JSON válido.', 422);
            }

            // 2️⃣ Validar estructura mínima
            foreach ($dataset as $row) {
                if (!isset($row['order'], $row['address'])) {
                    return response()->error(
                        'Cada fila debe contener "order" y "address".',
                        422
                    );
                }
            }

            // 3️⃣ Reutilizar enriquecimiento EXACTO de getItemsAll()
            $items            = $route->items ?? collect();
            $itemsByAddr      = $items->keyBy('origin_address');

            $normalize = static function (string $s): string {
                $s = mb_strtolower(trim($s));
                $s = preg_replace('/[^\p{L}\p{N}\s#,.:-]/u', '', $s);
                $s = preg_replace('/\s+usa?$/', '', $s);
                $s = preg_replace('/\s+california$/', '', $s);
                return preg_replace('/\s+/', ' ', $s);
            };

            $itemsByAddrNorm = [];
            foreach ($items as $it) {
                $k = $normalize((string) $it->origin_address);
                if ($k !== '') {
                    $itemsByAddrNorm[$k] = $it;
                }
            }

            foreach ($dataset as &$row) {
                $addr = (string) ($row['address'] ?? '');
                $item = $itemsByAddr->get($addr);

                if (!$item && $addr !== '') {
                    $norm = $normalize($addr);
                    if (isset($itemsByAddrNorm[$norm])) {
                        $item = $itemsByAddrNorm[$norm];
                    }
                }

                $row['guide']               = $item->guide               ?? null;
                $row['name']                = $item->name                ?? null;
                $row['phone']               = isset($item->phone) ? (string) $item->phone : '';
                $row['origin_address']      = $item->origin_address      ?? $addr;
                $row['destination_address'] = $item->destination_address ?? '';
                $row['type']                = $item->type                ?? 'deliver';
            }
            unset($row);

            // 4️⃣ Persistir resultado manual
            $route->cache_json = json_encode(
                ['dataset' => $dataset],
                JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
            );
            $route->prompt    = $rawPrompt;
            $route->ia_status = 'order1';
            $route->save();

            // 5️⃣ Resolver coordenadas (flujo normal)
            return $this->resolveItemsGoogleMap($route);

        } catch (ModelNotFoundException $e) {
            return response()->error('Ruta no encontrada.', 404);
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * POST /routes/{id}/ia-manual-import
     * Procesa un payload de paquetes, genera una lista de direcciones enriquecida
     * y prepara el prompt de optimización para Gemini.
     */
    
    public function setIaManualImport(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'packages' => 'required|array',
            ]);

            $route       = Routes::findOrFail($id);
            $origin      = $route->origin_address;
            $destination = $route->destination_address;

            $cacheKey = "gemini_route_{$id}";

            $routes_ready = [];
            $addressList  = "";

            foreach ($validated['packages'] as $index => $value) {

                $itemsSource = $value['items'] ?? $value['sender_location']['items'] ?? [];
                $cajas       = [];

                foreach ($itemsSource as $item) {
                    if (!empty($item['size'])) {
                        $cajas[] = $item['size'];
                    }
                }

                $locationData  = $value['sender_location']['sender_location'] ?? $value['sender_location'] ?? [];
                $formattedAddr = $value['sender_location']['sender_formatted_address']
                                    ?? $value['address']
                                    ?? 'Sin dirección';

                $guideNumber  = $value['guideNumber'] ?? 'S/N';
                $lat          = $locationData['lat'] ?? 0;
                $lng          = $locationData['lng'] ?? 0;
                $phoneSender  = $value['sender_location']['phone_sender'] ?? $value['phone_sender'] ?? 'N/A';
                $pickupDay    = $value['sender_location']['pickup_day'] ?? $value['day'] ?? 1;
                $deliveryDay  = $value['sender_location']['delivery_day'] ?? null;
                $deposit      = $value['sender_location']['deposit'] ?? $value['deposit'] ?? 0;
                $cost         = $value['sender_location']['cost'] ?? $value['cost'] ?? 0;

                if ($deliveryDay) {
                    $pickupDay = null;
                }

                if($formattedAddr=='Sin dirección'){
                    $formattedAddr=$value["output_address"];
                    //p($value["output_address"]);
                }

                $addressList .= ($index + 1) . ") - {$formattedAddr}"
                    . " | guideNumber: {$guideNumber}"
                    . " | cajas: " . json_encode($cajas)
                    . " | type: " . ($value['type'] ?? 'pickup')
                    . " | phone_sender: {$phoneSender}"
                    . " | pickup_day: {$pickupDay}"
                    . " | delivery_day: {$deliveryDay}"
                    . " | deposit: {$deposit}"
                    . " | cost: {$cost}"
                    . " | Lat: {$lat}"
                    . " | Lng: {$lng}\n";

                $itemsParts = [];
                foreach ($itemsSource as $k => $item) {
                    $size = $item['size'] ?? 'Box';
                    $itemsParts[] = "{$guideNumber}_{$size}" . ($k + 1) . "_MOV";
                }

                $routes_ready[] = [
                    'order'        => $index + 1,
                    'guide'        => $guideNumber,
                    'address'      => $formattedAddr,
                    'lat'          => (float) $lat,
                    'lng'          => (float) $lng,
                    'guide_items'  => implode(',', $itemsParts),
                    'cajas'        => $cajas,
                    'name'         => $value['name_sender'] ?? 'Cliente Movex',
                    'phone'        => $phoneSender,
                    'pickup_day'   => $pickupDay,
                    'delivery_day' => $deliveryDay,
                    'deposit'      => $deposit,
                    'cost'         => $cost,
                    'type'         => $value['type'] ?? 'pickup',
                ];
            }

            $prompt = <<<EOT
            Actúa como experto en logística. Ordena estas paradas de forma eficiente de Roseville a Bakersfield.
            INICIO: {$origin} | DESTINO: {$destination}

            REGLAS:
            - Devuelve EXCLUSIVAMENTE un JSON (array de objetos).
            - No incluyas Inicio ni Destino en el JSON.
            - Mantén guideNumber, cajas y phone_sender intactos.
            - SI lat o lng vienen en 0, null o no existen, DEBES geolocalizar la dirección y devolver lat y lng correctos.
            - NO devuelvas lat/lng en cero si la dirección es válida.


            FORMATO:
            [{"order":1,"address":"...","lat":0,"lng":0,"guideNumber":"...","cajas":[],"phone_sender":"...","pickup_day":1,"delivery_day":1}]

            PARADAS:
            {$addressList}
            EOT;

            /**
             * ==========================
             * 🔒 CACHE: si existe, usarlo
             * ==========================
             */
            if (Cache::has($cacheKey)) {
                $optimizedDataset = Cache::get($cacheKey);
            } else {

                

                $response = Http::withHeaders(['Content-Type' => 'application/json'])
                    ->timeout(350)
                    ->post($this->url, [
                        'contents' => [[
                            'role'  => 'user',
                            'parts' => [['text' => $prompt]],
                        ]]
                    ]);

                if (!$response->successful()) {
                    return response()->success(
                        ['routes' => $routes_ready, 'addressList' => $addressList],
                        'Fallback: Orden original.'
                    );
                }

                $rawText          = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                $cleanJson        = preg_replace('/^```json\s*|```$/m', '', trim($rawText));
                $optimizedDataset = json_decode($cleanJson, true);

                // Guardar en cache (permanente o con TTL)
                Cache::put($cacheKey, $optimizedDataset, now()->addDays(7));
            }

            /**
             * ==========================
             * 🔁 Re-mapeo técnico final
             * ==========================
             */
            $finalRoutes = [];

            foreach ($optimizedDataset as $iaRow) {
                $original = collect($routes_ready)->firstWhere('guide', $iaRow['guideNumber']);
                $pkgOriginal = collect($request->packages)->first(function ($pkg) use ($iaRow) {
                    return
                        ($pkg['guideNumber'] ?? null) === $iaRow['guideNumber']
                        || ($pkg['sender_location']['guideNumber'] ?? null) === $iaRow['guideNumber'];
                });
                
                if ($original) {
                    $iaRow['pickup_day']        =   (!empty($pkgOriginal["pickup_day"]) && empty($pkgOriginal['delivery_day']))?$pkgOriginal['pickup_day']:null;
                    $iaRow['delivery_day']      =   (empty($pkgOriginal['pickup_day']) && !empty($pkgOriginal['delivery_day']))?$pkgOriginal['delivery_day']:null;
                    if($iaRow['delivery_day']){
                        $iaRow['pickup_day']    =   null;
                    }
                    $iaRow['guide_items']   =   $original['guide_items'];
                    $iaRow['cost']          =   $original['cost'];
                    $iaRow['deposit']       =   $original['deposit'];
                    $finalRoutes[]          =   $iaRow;
                }                
            }
            

            return response()->success(
                ['routes' => $finalRoutes, 'addressList' => $addressList,"prompt"=>$prompt],
                'Ruta optimizada (cacheada).'
            );

        } catch (\Throwable $e) {
            return response()->error("Error: " . $e->getMessage(), 500);
        }
    }

    public function setIaManualImportSinChache(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'packages' => 'required|array',
            ]);

            $route          =   Routes::findOrFail($id);
            $origin         =   $route->origin_address;
            $destination    =   $route->destination_address;

            $routes_ready = [];
            $addressList = "";

            foreach ($validated['packages'] as $index => $value) {
                // 1. Extraer cajas (Items)
                $cajas = [];
                $itemsSource = $value['items'] ?? $value['sender_location']['items'] ?? [];
                foreach ($itemsSource as $item) {
                    if (isset($item['size'])) $cajas[] = $item['size'];
                }
                $cajasJson          =   json_encode($cajas);

                // 2. Extraer ubicación de forma segura
                $locationData       =   $value['sender_location']['sender_location'] ?? $value['sender_location'] ?? null;
                $formattedAddr      =   $value['sender_location']['sender_formatted_address'] ?? $value['address'] ?? 'Sin dirección';
                $guideNumber        =   $value['guideNumber'] ?? 'S/N';

                // 3. Manejo de Coordenadas
                $lat = $locationData['lat'] ?? 0;
                $lng = $locationData['lng'] ?? 0;

                // 4. Construcción del string para la IA (con validaciones de nulos)
                // Usamos ?? para evitar el error "Undefined array key"
                $phoneSender = $value['sender_location']['phone_sender'] ?? $value['phone_sender'] ?? 'N/A';
                $pickupDay   = $value['sender_location']['pickup_day'] ?? $value['day'] ?? 1;
                
                $deliveryDay = $value['sender_location']['delivery_day']??null;
                if($deliveryDay){
                    $pickupDay   =  null;
                }

                $deposit     = $value['sender_location']['deposit'] ?? $value['deposit'] ?? 0;
                $cost        = $value['sender_location']['cost'] ?? $value['cost'] ?? 0;

                $addressList .= ($index + 1) . ") - " . $formattedAddr . 
                                " | guideNumber: " . $guideNumber . 
                                " | cajas: " . $cajasJson . 
                                " | type: " . ($value['type'] ?? 'pickup') . 
                                " | phone_sender: " . $phoneSender .
                                " | pickup_day: " . $pickupDay .
                                " | delivery_day: " . $deliveryDay .
                                " | deposit: " . $deposit .
                                " | cost: " . $cost .
                                " | Lat: " . $lat . 
                                " | Lng: " . $lng . "\n";

                // 5. Generar guide_items para el sistema
                $itemsParts = [];
                foreach ($itemsSource as $key2 => $item) {
                    $size = $item['size'] ?? 'Box';
                    $itemsParts[] = $guideNumber . "_" . $size . ($key2 + 1) . "_MOV";
                }

                // Guardamos en memoria para enriquecer la respuesta de Gemini después
                $routes_ready[] = [
                    'order'       => $index + 1,
                    'guide'       => $guideNumber,
                    'address'     => $formattedAddr,
                    'lat'         => (float)$lat,
                    'lng'         => (float)$lng,
                    'guide_items' => implode(',', $itemsParts),
                    'cajas'       => $cajas,
                    'name'        => $value['name_sender'] ?? 'Cliente Movex',
                    'phone'       => $phoneSender,
                    'pickup_day'    => $pickupDay,
                    'delivery_day'  => $deliveryDay,
                    'deposit'     => $deposit,
                    'cost'        => $cost,
                    'type'        => $value['type'] ?? 'pickup'
                ];
            }

            // 6. Preparar Prompt para Gemini
            $prompt = <<<EOT
    Actúa como experto en logística. Ordena estas paradas de forma eficiente de Roseville a Bakersfield.
    INICIO: {$origin} | DESTINO: {$destination}
    REGLAS:
    - Devuelve EXCLUSIVAMENTE un JSON (array de objetos).
    - No incluyas Inicio ni Destino en el JSON.
    - Mantén guideNumber, cajas y phone_sender intactos.
    FORMATO: [{"order":1, "address":"...", "lat":0.0, "lng":0.0, "guideNumber":"...", "cajas":[], "phone_sender":"...", "pickup_day":1, "delivery_day":1}]
    PARADAS:
    {$addressList}
    EOT;

            // 7. Llamada a Gemini
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(350)
                ->post($this->url, [
                    'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]]
                ]);

            if ($response->successful()) {
                $rawText            =   data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                $cleanJson          =   preg_replace('/^```json\s*|```$/m', '', trim($rawText));
                $optimizedDataset   =   json_decode($cleanJson, true);

                // 8. Re-mapear con datos técnicos (guide_items)
                $finalRoutes = [];
                if (is_array($optimizedDataset)) {
                    foreach ($optimizedDataset as $iaRow) {
                        $original = collect($routes_ready)->firstWhere('guide', $iaRow['guideNumber']);
                        if ($original) {
                            $iaRow['guide_items']   =   $original['guide_items'];
                            $iaRow['cost']          =   $original['cost'];
                            $iaRow['deposit']       =   $original['deposit'];
                            p([$iaRow,$original]);
                            $finalRoutes[]          =   $iaRow;
                        }
                    }
                    return response()->success(['routes' => $finalRoutes,"addressList"=>$addressList], 'Ruta optimizada.');
                }
            }

            return response()->success(['routes' => $routes_ready, "addressList"=>$addressList], 'Fallback: Orden original.');

        } catch (\Throwable $e) {
            return response()->error("Error: " . $e->getMessage(), 500);
        }
    }
    /**
     * POST /routes/{id}/ia-manual-import
     * Recibe paquetes, consulta a Gemini para optimizar el orden y devuelve el dataset final.
     */
    public function setIaManualImport22222(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'packages' => 'required|array',
            ]);

            $route = Routes::findOrFail($id);
            $origin = $route->origin_address;
            $destination = $route->destination_address;

            $routes_ready = [];
            $addressList = "";

            foreach ($validated['packages'] as $index => $value) {
                //p($value);
                // 1. Extraer cajas
                $cajas = [];
                $itemsSource = $value['items'] ?? $value['sender_location']['items'] ?? [];
                foreach ($itemsSource as $item) {
                    if (isset($item['size'])) $cajas[] = $item['size'];
                }

                // 2. Extraer ubicación y construir lista para el prompt
                $locationData  = $value['sender_location']['sender_location'] ?? $value['sender_location'] ?? null;
                $formattedAddr = $value['sender_location']['sender_formatted_address'] ?? $value['address'] ?? 'Sin dirección';
                $guideNumber   = $value['guideNumber'] ?? 'S/N';
                $cajasJson     = json_encode($cajas);

                $lat = 0; $lng = 0;
                if ($locationData&&isset($value["sender_location"]["pickup_day"])) {
                    $lat = $locationData['lat'] ?? 0;
                    $lng = $locationData['lng'] ?? 0;
                    //p($value["sender_location"], false);
                    $addressList .= ($index + 1) . ") - " . $formattedAddr . 
                                    " | guideNumber: " . $guideNumber . 
                                    " | cajas: " . $cajasJson . 
                                    " | type: " . $value["type"] . 
                                    " | phone_sender: " . $value["sender_location"]["phone_sender"] .
                                    " | address: " . $locationData["sender_formatted_address"] .
                                    " | pickup_day: " . ($value["sender_location"]["pickup_day"] ?? 1) .
                                    " | deposit: " . $value["sender_location"]["deposit"] .
                                    " | cost: " . $value["sender_location"]["cost"] .
                                    " | Lat: " . $lat . 
                                    " | Lng: " . $lng . "\n";
                } else {
                    // Extraemos la ubicación del segundo nivel de sender_location que es donde están las coordenadas
                    $locationInfo = $value['sender_location']['sender_location'] ?? null;
                    
                    $lat = $locationInfo['lat'] ?? 0;
                    $lng = $locationInfo['lng'] ?? 0;
                    
                    // Mapeo de campos según el payload proporcionado
                    $addressList .= ($index + 1) . ") - " . ($value['address'] ?? 'Sin dirección') . 
                                    " | guideNumber: " . ($value['guideNumber'] ?? 'S/N') . 
                                    " | cajas: " . $cajasJson . 
                                    " | type: " . ($value['type'] ?? 'pickup') . 
                                    " | phone_sender: " . ($value['sender_location']['phone_sender'] ?? $value['phone_sender'] ?? 'N/A') .
                                    " | address: " . ($value['sender_location']['sender_formatted_address'] ?? $value['address'] ?? 'N/A') .
                                    " | pickup_day: " . ($value['day'] ?? $value['sender_location']['pickup_day'] ?? 1) .
                                    " | deposit: " . ($value['deposit'] ?? 0) .
                                    " | cost: " . ($value['cost'] ?? 0) .
                                    " | Lat: " . $lat . 
                                    " | Lng: " . $lng . "\n";
                }

                // 3. Generar guide_items para Ivoolve
                $itemsParts = [];
                foreach ($itemsSource as $key2 => $item) {
                    $size = $item['size'] ?? 'Box';
                    $itemsParts[] = $guideNumber . "_" . $size . ($key2 + 1) . "_MOV";
                }

                // Guardamos en memoria por si la IA falla (fallback)
                $routes_ready[] = [
                    'order'       => $index + 1,
                    'guide'       => $guideNumber,
                    'address'     => $formattedAddr,
                    'lat'         => (float)$lat,
                    'lng'         => (float)$lng,
                    'guide_items' => implode(',', $itemsParts),
                    'cajas'       => $cajas
                ];
            }

            //p($addressList);

            // 4. Preparar Prompt para Gemini
            $prompt = <<<EOT
Actúa como experto en logística. Ordena estas paradas intermedias de forma eficiente.
INICIO: {$origin} | DESTINO: {$destination}
REGLAS OBLIGATORIAS:
1. Devuelve EXCLUSIVAMENTE un JSON válido (un array de objetos).
2. No incluyas el punto de Inicio ni el de Destino dentro del JSON.
3. No modifiques el texto de las direcciones, nombres o números telefónicos.
4. Mantén TODOS los campos técnicos (guideNumber, cajas, phone_sender, etc.) asociados a cada dirección.
FORMATO DE RESPUESTA REQUERIDO:
[
  {
    "order": 1,
    "address": "...",
    "lat": 0.0,
    "lng": 0.0,
    "guideNumber": "...",
    "cajas": [...],
    "type": "...",
    "phone_sender": "...",
    "pickup_day": 0,
    "deposit": 0,
    "cost": 0
  }
]
PARADAS:
{$addressList}
EOT;

            // 5. Llamada a Gemini
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(350)
                ->post($this->url, [
                    'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]]
                ]);

            $optimizedDataset = [];
            if ($response->successful()) {
                $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                
                // Limpiar posibles bloques de código Markdown
                $cleanJson = preg_replace('/^```json\s*|```$/m', '', trim($rawText));
                $optimizedDataset = json_decode($cleanJson, true);
            }

            // 6. Enriquecer el resultado de la IA con los datos originales (guide_items, etc)
            $finalRoutes = [];
            if (is_array($optimizedDataset) && !empty($optimizedDataset)) {
                foreach ($optimizedDataset as $iaRow) {
                    // Buscamos el match en nuestro array original para recuperar info técnica
                    $original = collect($routes_ready)->firstWhere('guide', $iaRow['guideNumber']);
                    if ($original) {
                        $iaRow['guide_items'] = $original['guide_items'];
                        $finalRoutes[] = $iaRow;
                    }
                }
            } else {
                $finalRoutes = $routes_ready; // Fallback si la IA falla
            }

            return response()->success([
                'routes' => $finalRoutes,
                'prompt_used' => $prompt
            ], 'Hoja de ruta optimizada por IA correctamente.');

        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }







}