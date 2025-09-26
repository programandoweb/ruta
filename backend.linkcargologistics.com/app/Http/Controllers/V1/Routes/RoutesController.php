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



class RoutesController extends Controller
{
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
                $url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                // ✅ CORRECCIÓN DE TIMEOUT
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json'
                ])->timeout(150)->post($url, [
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
                    $url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";
                    // ✅ CORRECCIÓN DE TIMEOUT
                    $response = Http::timeout(150)->post($url, [
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

            $iaData = []; // Inicializamos la variable de datos de la IA
            $addressListString = "";

            // Paso 2: Verificamos si hay items en la ruta.
            if ($route->items->isNotEmpty()) {
                
                // Paso 3: Creamos clave de caché única.
                $itemsHash  =   md5($route->items->pluck('id')->toJson());
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
                    $response = Http::timeout(150)->post($url, [
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
                    $availableItems = $route->items->keyBy('id')->all();

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
                                $highestSimilarity = $percent;
                                $bestMatchId = $itemId;
                            }
                        }

                        // 5. Si la mejor coincidencia que encontramos supera nuestro umbral...
                        if ($highestSimilarity >= $similarityThreshold) {
                            // ...la asignamos...
                            $iaItem['id_direccion_item'] = $bestMatchId;
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

            return response()->success(array_merge([
                'route' => $route,
                'ia'    => $iaData, // $iaData ahora contiene el dataset con 'id_direccion_item'
                'addressListString' => $addressListString
            ], $extra), 'Hoja de ruta obtenida correctamente 2026.');

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
                    $url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                    // ✅ CORRECCIÓN DE TIMEOUT
                    $response = Http::timeout(150)->post($url, [
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
     * Actualizar una ruta existente con sus items
     */
    public function update(Request $request, string $id)
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
            $route->update($validated);

            if (isset($validated['items'])) {
                $route->items()->delete();
                foreach ($validated['items'] as $item) {
                    $route->items()->create($item);
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
}