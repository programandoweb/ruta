<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Repositories;

use App\Models\Notification;

class NotificationRepository
{
    /**
     * Retorna todas las notificaciones paginadas, con filtros por rol y búsqueda.
     */
    public function getAll($request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $user    = $request->user();
        $query   = Notification::query();

        // Selección de campos con alias en español
        $query->selectRaw('
            from_user_id,
            to_user_id,
            from_user_id   AS remitente,
            to_user_id     AS destinatario,
            status         AS estado,
            concepto       AS titulo,
            tipo           AS tipo,
            id
        ');

        $query->with(["fromUser","toUser"]);

        // Filtro por roles
        if ($user->hasRole(['super-admin', 'admin'])) {
            // sin restricción
        } else {
            $query->where('to_user_id', $user->id);
        }

        // Búsqueda por concepto o tipo
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('concepto', 'like', "%{$search}%")
                ->orWhere('tipo', 'like', "%{$search}%");
            });
        }

        // Filtro por estado leído/no leído
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage)->through(function ($item) {
            //p($item);
            $item->remitente    =   $item->fromUser?->name;
            $item->destinatario =   $item->toUser?->name;
            unset($item->from_user_id);
            unset($item->to_user_id);
            unset($item->fromUser);
            unset($item->toUser);
            return $item;
        });

        //return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }


    public function create(array $data): ?Notification
    {
        return Notification::create($data);
    }

    public function findById($id): ?Notification
    {
        return Notification::with(['fromUser', 'toUser'])->find($id);
    }


    public function update($id, array $data): ?Notification
    {
        $notification = Notification::find($id);
        if ($notification) {
            $notification->update($data);
        }
        return $notification;
    }

    public function delete($id): bool
    {
        $notification = Notification::find($id);
        return $notification ? $notification->delete() : false;
    }
}
