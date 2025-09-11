<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Events;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\EventInvitationRepository;

class EventInvitationController extends Controller
{
    protected $repository;

    public function __construct(EventInvitationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        $items = $this->repository->paginate($request);
        return response()->success(compact('items'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'  => 'required|exists:events,id',
            'name'      => 'required|string|max:255',
            'email'     => 'nullable|email|max:255',
            'status'    => 'nullable|string|in:pending,confirmed,rejected',
            'notes'     => 'nullable|string|max:500',
        ]);

        $item = $this->repository->store($validated);
        return response()->success(compact('item'), 'Invitado registrado correctamente');
    }

    public function show(string $id)
    {
        $item = $this->repository->find($id);
        return response()->success(compact('item'));
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'      => 'sometimes|required|string|max:255',
            'email'     => 'nullable|email|max:255',
            'status'    => 'nullable|string|in:pending,confirmed,rejected',
            'notes'     => 'nullable|string|max:500',
        ]);

        $item = $this->repository->update($id, $validated);
        return response()->success(compact('item'), 'Invitado actualizado correctamente');
    }

    public function destroy(string $id)
    {
        $this->repository->destroy($id);
        return response()->success([], 'Invitado eliminado correctamente');
    }
}
