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

namespace App\Http\Controllers\V1\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\UserCharacteristicsRepository;
use Illuminate\Support\Facades\Validator;

class UserCharacteristicsController extends Controller
{
    protected $userCharacteristicsRepository;

    public function __construct(UserCharacteristicsRepository $userCharacteristicsRepository)
    {
        $this->userCharacteristicsRepository = $userCharacteristicsRepository;
    }

    public function index(Request $request)
    {
        try {
            $characteristics = $this->userCharacteristicsRepository->getAll($request);
            return response()->success(compact('characteristics'), "Listado de características");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id'     => 'required|exists:users,id',
                'key'         => 'required|string|max:255',
                'value'       => 'nullable|string|max:1000',
            ]);

            $characteristic = $this->userCharacteristicsRepository->create($validated);
            return response()->success(compact('characteristic'), "Característica registrada exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $characteristic = $this->userCharacteristicsRepository->findById($id);
            if (!$characteristic) {
                return response()->error("Característica no encontrada", 404);
            }

            return response()->success(compact('characteristic'), "Característica encontrada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'key'   => 'sometimes|required|string|max:255',
                'value' => 'nullable|string|max:1000',
            ]);

            $characteristic = $this->userCharacteristicsRepository->update($id, $validated);
            if (!$characteristic) {
                return response()->error("Característica no encontrada", 404);
            }

            return response()->success(compact('characteristic'), "Característica actualizada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->userCharacteristicsRepository->delete($id);
            if (!$deleted) {
                return response()->error("Característica no encontrada", 404);
            }

            return response()->success([], "Característica eliminada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
