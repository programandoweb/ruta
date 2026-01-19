<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - CommentsRepository
 * ---------------------------------------------------
 */

namespace App\Repositories;

use Illuminate\Http\Request;
use App\Models\Comments;

class CommentsRepository
{
    /**
     * Obtener comentarios por pathname o module (con usuario incluido).
     */
    public function getByPathname(?string $pathname, ?string $module = null)
    {
        return Comments::query()
            ->with('user')
            ->when($pathname, fn($q) => $q->where('pathname', $pathname))
            ->when($module, fn($q) => $q->where('module', $module))
            ->latest('created_at')
            ->get();
    }

    /**
     * 🔹 Versión compatible: obtener comentarios por modelo y búsqueda.
     */
    public function getByModel(string $model, ?string $search = null)
    {
        $query = Comments::query()
            ->selectRaw("
                model,
                user_id,
                content,
                timestamp,
                (SELECT name FROM users WHERE users.id = comments.user_id) as usuario
            ")
            ->where('model', $model)
            ->orderByDesc('id');

        if ($search) {
            $query->where('content', 'like', "%{$search}%");
        }

        return $query->get();
    }

    /**
     * 🔹 Versión compatible: crear comentario basado en modelo.
     */
    public function setByModel(Request $request, string $model)
    {
        $user = $request->user();
        $data = $request->except(['user', 'timestamp']);
        $data['user_id'] = $user->id ?? null;
        $data['model'] = $model;

        return Comments::firstOrCreate($data);
    }

    /**
     * Listado paginado con filtros dinámicos (module, pathname, user_id, fechas, etc.)
     */
    public function getAll(Request $request)
    {
        $perPage  = (int) $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $module   = trim((string) $request->input('module', ''));
        $pathname = trim((string) $request->input('pathname', ''));
        $orderBy  = $request->input('order_by', 'created_at');
        $orderDir = $request->input('order_dir', 'desc');

        return Comments::query()
            ->with('user')
            //->when($module !== '', fn($q) => $q->where('module', $module))
            ->when($pathname !== '', fn($q) => $q->where('pathname', $pathname))
            ->orderBy($orderBy, $orderDir)
            ->paginate($perPage);
    }

    /**
     * Listado no paginado (dataset liviano, con filtros simples).
     */
    public function get(Request $request)
    {
        $limit    = (int) $request->input('limit', 100);
        $q        = $request->input('q', $request->input('search'));
        $module   = $request->input('module');
        $pathname = $request->input('pathname');
        $userId   = $request->input('user_id');

        return Comments::query()
            ->with('user')
            ->when($q, fn($qq) => $qq->where('mensaje', 'like', "%{$q}%"))
            ->when($module, fn($qq) => $qq->where('module', $module))
            ->when($pathname, fn($qq) => $qq->where('pathname', $pathname))
            ->when($userId, fn($qq) => $qq->where('user_id', $userId))
            ->latest('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Crear un nuevo comentario.
     */
    public function create(array $data): Comments
    {
        if (isset($data['json']) && is_array($data['json'])) {
            $data['json'] = json_encode($data['json'], JSON_UNESCAPED_UNICODE);
        }

        $data['type'] = $data['type'] ?? 'Comentario';

        return Comments::create([
            'mensaje'   => $data['mensaje'] ?? $data['content'] ?? null,
            'type'      => $data['type'],
            'image'     => $data['image'] ?? null,
            'module'    => $data['module'] ?? null,
            'pathname'  => $data['pathname'] ?? null,
            'json'      => $data['json'] ?? null,
            'user_id'   => $data['user_id'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'model'     => $data['model'] ?? null,
        ]);
    }

    /**
     * Actualizar un comentario existente.
     */
    public function update(string $id, array $data): ?Comments
    {
        $comment = Comments::find($id);
        if (!$comment) return null;

        if (isset($data['json']) && is_array($data['json'])) {
            $data['json'] = json_encode($data['json'], JSON_UNESCAPED_UNICODE);
        }

        $data['type'] = $data['type'] ?? $comment->type ?? 'Comentario';

        $comment->update([
            'mensaje'   => $data['mensaje'] ?? $comment->mensaje,
            'type'      => $data['type'],
            'image'     => $data['image'] ?? $comment->image,
            'module'    => $data['module'] ?? $comment->module,
            'pathname'  => $data['pathname'] ?? $comment->pathname,
            'json'      => $data['json'] ?? $comment->json,
            'user_id'   => $data['user_id'] ?? $comment->user_id,
        ]);

        return $comment;
    }

    /**
     * Eliminar un comentario.
     */
    public function delete(string $id): bool
    {
        $comment = Comments::find($id);
        return $comment ? (bool) $comment->delete() : false;
    }

    /**
     * Buscar comentario por ID (con relación de usuario).
     */
    public function findById(string $id): ?Comments
    {
        return Comments::with('user')->find($id);
    }
}
