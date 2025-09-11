<?php

namespace App\Http\Controllers\V1\Servicios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\ServiciosRepository;
use App\Repositories\CalendarAvailabilitiesRepository;
use App\Models\UnifiedLocations;
use App\Models\EventSchedule;
use App\Services\DownloadService;
use App\Models\CalendarSlots;
use Illuminate\Support\Str;



class ServiciosController extends Controller
{
    protected $serviciosRepository;
    protected $unifiedLocations;
    protected $eventSchedule;
    protected $calendarRepository;

    public function __construct (   ServiciosRepository $serviciosRepository,
                                    UnifiedLocations $unifiedLocations,
                                    EventSchedule $eventSchedule,
                                    CalendarAvailabilitiesRepository $calendarRepository
                                )
    {
        $this->serviciosRepository      =   $serviciosRepository;
        $this->unifiedLocations         =   $unifiedLocations;
        $this->eventSchedule            =   $eventSchedule;
        $this->calendarRepository       =   $calendarRepository;
    }

    public function schedule(Request $request)
    {
        try {
            $data = $request->all();

            // Obtener ID del usuario autenticado (cliente)
            $clientId = auth()->id();
            if (!$clientId) {
                return response()->error("No autenticado", 401);
            }

            $servicio   =   $this->serviciosRepository->findById($data["id"]);

            if(!$servicio){
                return response()->error("Servicio no autorizado", 401);
            }

            $schedule   =   $this->eventSchedule->updateOrCreate(
                [
                    'client_id'   => $clientId,
                    'provider_id' => $servicio->user_id,
                    'servicio_id' => $servicio->id,
                ],
                [
                    'status'       => 'pendiente',
                    'scheduled_at' => null,
                ]
            );

            create_notification([
                'to_user_id'   => $servicio->user_id,
                'concepto'     => 'Nueva cita agendada',
                'descripcion'  => 'Tienes una nueva solicitud de cita',
                'tipo'         => 'cita',
                'related_type' => $schedule->id,
            ]);


            return response()->success(compact('schedule'), "schedule dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function service(string $id)
    {
        $service        =   $this->serviciosRepository->getService($id);
        $gallery        =   $service->gallery;
        
        if(!is_array($service->gallery)){
            $gallery     =  json_decode($service->gallery);
        }

        $name        = $service->name        ?? 'Prueba';
        $description = $service->description ?? 'Descripción por defecto';
        $baseUrl     = env('APP_URL');
        $firstImage  = $gallery[0] ?? '';

        $seo = (object) [
            'title'       => $name,
            'description' => $description,
            'openGraph'   => (object) [
                'title'       => $name,
                'description' => $description,
                'image'       => Str::startsWith($firstImage, ['http://', 'https://'])
                    ? $firstImage
                    : $baseUrl . '/' . ltrim($firstImage, '/'),
            ],
        ];

        $users = \App\Models\User::whereNotNull('customer_group_id')->get();

        $availabilities =   $this->calendarRepository->getByProvider($service->user_id);
        $providerId     =   $service->user_id;

        // Recolectar datos para el mismo response que calendar_slots()
        $slots = CalendarSlots::with(['client:id,name,email','provider:id,name,email','employee:id,name,email'])
            ->where('provider_id', $providerId)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->success(compact('service', 'seo','availabilities','slots'), "detail service 2025");
    }

    public function related_items(string $slug){
        try {
            $related_items   =   $this->serviciosRepository->getBySlug($slug);
            return response()->success(compact('related_items'), "dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
    

    public function get(DownloadService $downloadService){
        try {
            $services       =   $this->serviciosRepository->get();
            //$locations      =   $this->unifiedLocations->get();
            //return $downloadService->downloadJson($locations, 'locations.json');
            return response()->success(compact('services'), "dataset");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Listar todos los servicios.
     */
    public function index(Request $request)
    {
        try {
            $services = $this->serviciosRepository->getAll($request);
            return response()->success(compact('services'), "Listado de servicios 2025");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Crear un nuevo servicio.
     */
    public function store(Request $request)
    {
        try {
            // Decodifica 'gallery' si viene como string JSON
            $rawGallery = $request->input('gallery');
            if (is_string($rawGallery)) {
                $decoded = json_decode($rawGallery, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $request->merge(['gallery' => $decoded]);
                }
            }

            // Validación
            $validated = $request->validate([
                'name'         => 'required|string|max:255',
                'description'  => 'nullable|string',
                'category_id'  => 'nullable|integer|exists:services,id',
                'rating'       => 'nullable|integer|min:0|max:5',
                'location'     => 'nullable|string|max:255',
                'map'          => 'nullable|string',
                'image'        => 'nullable|string|max:255',
                'price'        => 'nullable|numeric',
                'gallery'      => 'nullable|array',
                'gallery.*'    => 'nullable|string|max:255',
            ]);

            // Asignar el user_id del usuario autenticado
            $validated['user_id'] = $request->user()->id;

            // Crear servicio
            $service = $this->serviciosRepository->create($validated);

            return response()->success(compact('service'), "Servicio creado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    /**
     * Mostrar un servicio específico.
     */
    public function show(string $id)
    {
        try {
            $service = $this->serviciosRepository->findById($id);
            if (!$service&&$id!='new') {
                return response()->error("Servicio no encontrado en Servicios", 404);
            }

            $services       =   $this->serviciosRepository->get();

            return response()->success(compact('service','services'), "Servicio encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Actualizar un servicio existente.
     */
    public function update(Request $request, string $id)
    {
        try {
            // Decodifica 'gallery' si viene como string JSON
            $rawGallery = $request->input('gallery');
            if (is_string($rawGallery)) {
                $decoded = json_decode($rawGallery, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $request->merge(['gallery' => $decoded]);
                }
            }

            // Validación
            $validated = $request->validate([
                'name'         => 'sometimes|required|string|max:255',
                'description'  => 'nullable|string',
                'category_id'  => 'nullable|integer|exists:services,id',
                'rating'       => 'nullable|integer|min:0|max:5',
                'location'     => 'nullable|string|max:255',
                'map'          => 'nullable|string',
                'image'        => 'nullable|string|max:255',
                'price'        => 'nullable|numeric',
                'gallery'      => 'nullable|array',
                'gallery.*'    => 'nullable|string|max:255',
            ]);

            // Actualiza el servicio
            $service = $this->serviciosRepository->update($id, $validated);
            if (!$service) {
                return response()->error("Servicio no encontrado en Servicios", 404);
            }

            return response()->success(compact('service'), "Servicio actualizado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * Eliminar un servicio.
     */
    public function destroy(string $id)
    {
        try {
            $deleted = $this->serviciosRepository->delete($id);
            if (!$deleted) {
                return response()->error("Servicio no encontrado en Servicios", 404);
            }

            return response()->success([], "Servicio eliminado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
