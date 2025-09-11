<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Repositories;

use App\Models\EventInvitation;
use Illuminate\Http\Request;

class EventInvitationRepository
{
    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
        $query   = EventInvitation::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->with('event')->paginate($perPage);
    }

    public function store(array $data): EventInvitation
    {
        return EventInvitation::create($data);
    }

    public function find(string $id): ?EventInvitation
    {
        return EventInvitation::with('event')->findOrFail($id);
    }

    public function update(string $id, array $data): ?EventInvitation
    {
        $item = EventInvitation::findOrFail($id);
        $item->update($data);
        return $item;
    }

    public function destroy(string $id): void
    {
        EventInvitation::destroy($id);
    }
}
