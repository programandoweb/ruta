<?php

namespace App\Http\Controllers\V1\Comments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\CommentsRepository;

class CommentsController extends Controller
{
    private $commentsRepository;

    public function __construct(CommentsRepository $commentsRepository)
    {
        $this->commentsRepository = $commentsRepository;
    }

    public function getBymodel($model){
        try {
            $comments = $this->commentsRepository->getBymodel($model);
            return response()->success(compact('comments'), "Listado de comentarios");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function setBymodel(Request $request, $model){
        try {
            $comments = $this->commentsRepository->setBymodel($request,$model);
            return $this->getBymodel($model);
            //return response()->success(compact('comments'), "Listado de comentarios");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

     /**
     * 🔹 Obtener los comentarios hijos (respuestas) de un comentario principal
     */
    public function summary_childrens($id, Request $request)
    {
        try {
            $user       = $request->user();

            $childrens  = Comments::with(['user:id,name,email'])
                ->where('parent_id', $id)
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id'         => $item->id,
                        'mensaje'    => $item->mensaje,
                        'usuario'    => $item->user?->name ?? '—',
                        'user_id'    => $item->user_id,
                        'type'       => $item->type,
                        'status'     => $item->status,
                        'created_at' => $item->created_at?->format('Y-m-d H:i:s'),
                        'updated_at' => $item->updated_at?->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->success(compact("childrens"), 'Comentarios hijos cargados con éxito.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    /**
     * Obtener todos los comentarios sin paginación.
     */
    public function summary(Request $request)
    {
        try {
            $search = $request->input('search');
            $type   = $request->input('type'); // opcional: 'Pagos', 'Comentario', 'Soporte', 'Reporte de Usuario'
            $user   = $request->user();

            $query = Comments::query()
                ->with(['user:id,name,email'])
                ->select(
                    'id',
                    'mensaje',
                    'type',
                    'image',
                    'module',
                    'pathname',
                    'json',
                    'status',
                    'user_id',
                    'created_at',
                    'updated_at'
                );

            // 🔹 Filtrado por tipo si se pasa desde el frontend
            if (!empty($type)) {
                $query->where('type', $type);
            }

            $query->whereNull('parent_id');

            // 🔹 Filtro de búsqueda general
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('mensaje', 'like', "%{$search}%")
                      ->orWhere('module', 'like', "%{$search}%")
                      ->orWhere('pathname', 'like', "%{$search}%");
                });
            }

            // 🔹 Control de acceso según roles
            if ($user->hasRole(['super-admin', 'admin'])) {
                // sin restricciones
            } elseif ($user->hasRole(['providers', 'employees', 'managers'])) {
                $query->where('user_id', $user->id);
            } else {
                $query->whereRaw('1 = 0'); // sin acceso
            }

            // 🔹 Ejecución del query
            $comments = $query
                ->orderByDesc('id')
                ->get()
                ->map(function ($item) {
                    $item->usuario = $item->user?->name ?? '—';
                    unset($item->user);
                    return $item;
                });

            return response()->success(compact("comments"), 'Listado de comentarios cargado con éxito.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    /**
     * GET /dashboard/comments
     * Listado paginado/filtrado.
     * Soporta filtros: module, pathname, user_id, q (búsqueda por mensaje).
     */
    public function index(Request $request)
    {
        try {
            $comments = $this->commentsRepository->getAll($request);
            return response()->success(compact('comments'), 'Listado de comentarios 2025');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/comments/get
     * Listado sin paginar (dataset liviano).
     */
    public function get(Request $request)
    {
        try {
            $comments = $this->commentsRepository->get($request);
            return response()->success(compact('comments'), 'Dataset cargado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/comments/{id}
     * Detalle por ID.
     */
    public function show(string $id)
    {
        try {
            $comment = $this->commentsRepository->findById($id);

            if (!$comment && $id !== 'new') {
                return response()->error('Comentario no encontrado', 404);
            }

            return response()->success(compact('comment'), 'Comentario encontrado');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // 🔹 Validar campos
            $validated = $request->validate([
                'mensaje'   => 'required|string',
                'type'      => 'nullable|in:Pagos,Comentario,Soporte,Reporte de Usuario',
                'image'     => 'nullable|string|max:255',
                'module'    => 'nullable|string',
                'pathname'  => 'nullable|string',
                'json'      => 'nullable',
                'user_id'   => 'nullable|integer|exists:users,id',
                'parent_id' => 'nullable|integer|exists:comments,id', // ✅ Nuevo campo opcional
            ]);

            // 🔹 Asignar usuario autenticado si existe sesión
            if (auth()->check()) {
                $validated['user_id'] = auth()->id();
            }

            // 🔹 Convertir json si llega como arreglo
            if (isset($validated['json']) && is_array($validated['json'])) {
                $validated['json'] = json_encode($validated['json'], JSON_UNESCAPED_UNICODE);
            }

            // 🔹 Valor por defecto para type
            $validated['type'] = $validated['type'] ?? 'Comentario';


            //p($validated);
            // 🔹 Crear comentario (puede ser hijo o raíz)
            $comment = $this->commentsRepository->create($validated);

            // 🔹 Si tiene parent_id => actualizar dataset solo de hijos
            if (!empty($validated['parent_id'])) {

                return $this->summary_childrens($validated['parent_id'],$request);
                $childrens = $this->commentsRepository->getChildrens($validated['parent_id']);
                return response()->success(
                    compact('comment', 'childrens'),
                    'Respuesta registrada exitosamente.'
                );
            }

            // 🔹 Obtener comentarios relacionados al mismo pathname
            $comments = $this->commentsRepository->getByPathname($validated['pathname'] ?? null);

            return response()->success(
                compact('comment', 'comments'),
                'Comentario creado exitosamente.'
            );
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    /**
     * POST /dashboard/comments
     * Crear comentario.
     * Incluye el campo 'type' (enum: Pagos | Comentario).
     * Retorna además todos los comentarios del mismo pathname.
     */
    public function storeOLD(Request $request)
    {
        try {
            // 🔹 Validación de los campos
            $validated = $request->validate([
                'mensaje'  => 'required|string',
                'type'     => 'nullable|in:Pagos,Comentario', // Campo tipo de mensaje
                'image'    => 'nullable|string|max:255',
                'module'   => 'nullable|string',
                'pathname' => 'nullable|string',
                'json'     => 'nullable',
                'user_id'  => 'nullable|integer|exists:users,id',
            ]);

            // 🔹 Asignar usuario autenticado si existe sesión
            if (auth()->check()) {
                $validated['user_id'] = auth()->id();
            }

            // 🔹 Convertir json si llega como arreglo
            if (isset($validated['json']) && is_array($validated['json'])) {
                $validated['json'] = json_encode($validated['json'], JSON_UNESCAPED_UNICODE);
            }

            // 🔹 Valor por defecto para type
            $validated['type'] = $validated['type'] ?? 'Comentario';

            //p($validated);

            // 🔹 Crear comentario
            $comment = $this->commentsRepository->create($validated);

            // 🔹 Obtener comentarios relacionados al mismo pathname
            $comments = $this->commentsRepository->getByPathname($validated['pathname'] ?? null);

            return response()->success(
                compact('comment', 'comments'),
                'Comentario creado exitosamente'
            );
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * PUT /dashboard/comments/{id}
     * Actualizar comentario existente.
     * Incluye campo 'type' en validación y actualización.
     */
    public function update(string $id, Request $request)
    {
        try {
            $comment = $this->commentsRepository->findById($id);

            if (!$comment) {
                return response()->error('Comentario no encontrado', 404);
            }

            // 🔹 Validar datos
            $validated = $request->validate([
                'mensaje'   => 'required|string',
                'type'      => 'nullable|in:Pagos,Comentario', // Aceptar valores válidos
                'image'     => 'nullable|string|max:255',
                'module'    => 'nullable|string',
                'pathname'  => 'nullable|string',
                'json'      => 'nullable',
                'user_id'   => 'nullable|integer|exists:users,id',
            ]);

            // 🔹 Serializar JSON si corresponde
            if (isset($validated['json']) && is_array($validated['json'])) {
                $validated['json'] = json_encode($validated['json'], JSON_UNESCAPED_UNICODE);
            }

            // 🔹 Mantener tipo actual si no se envía
            $validated['type'] = $validated['type'] ?? $comment->type ?? 'Comentario';

            // 🔹 Actualizar registro
            $this->commentsRepository->update($id, $validated);

            return $this->show($id);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * DELETE /dashboard/comments/{id}
     * Eliminar comentario por ID.
     */
    public function destroy(string $id)
    {
        try {
            $deleted = $this->commentsRepository->delete($id);

            if (!$deleted) {
                return response()->error('Comentario no encontrado', 404);
            }

            return response()->success([], 'Comentario eliminado exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
