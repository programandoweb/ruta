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

namespace App\Http\Controllers\V1\Providers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\ProviderRepository;

class ProvidersController extends Controller
{
    protected $providerRepository;

    public function __construct(ProviderRepository $providerRepository)
    {
        $this->providerRepository = $providerRepository;
    }

    public function index(Request $request)
    {
        try {
            $providers = $this->providerRepository->getAll($request);
            return response()->success(compact('providers'), "Listado de proveedores");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'                   => 'required|string|max:255',
                'company_name'           => 'nullable|string|max:255',
                'email'                  => 'required|email|max:255|unique:users,email',
                'password'               => 'required|string|min:6',
                'user_type'              => 'nullable|in:natural,juridico',
                'phone_number'           => 'nullable|string|max:20',
                'address'                => 'nullable|string|max:255',
                'city'                   => 'nullable|string|max:255',
                'state'                  => 'nullable|string|max:255',
                'postal_code'            => 'nullable|string|max:20',
                'country'                => 'nullable|string|size:2',
                'identification_number'  => 'nullable|string|max:50',
                'identification_type'    => 'nullable|string|max:20',
                'tax_no'                 => 'nullable|string|max:50',
            ]);

            $validated['password'] = bcrypt($validated['password']);

            $provider = $this->providerRepository->create($validated);
            return response()->success(compact('provider'), "Proveedor creado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $provider = $this->providerRepository->findById($id);

            if (! $provider && $id!='new') {
                return response()->error("Proveedor no encontrado", 404);
            }

            return response()->success(compact('provider'), "Proveedor encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name'                   => 'sometimes|required|string|max:255',
                'company_name'           => 'nullable|string|max:255',
                'email'                  => 'sometimes|required|email|max:255|unique:users,email,' . $id,
                'password'               => 'nullable|string|min:6',
                'user_type'              => 'nullable|in:natural,juridico',
                'phone_number'           => 'nullable|string|max:20',
                'address'                => 'nullable|string|max:255',
                'city'                   => 'nullable|string|max:255',
                'state'                  => 'nullable|string|max:255',
                'postal_code'            => 'nullable|string|max:20',
                'country'                => 'nullable|string|size:2',
                'identification_number'  => 'nullable|string|max:50',
                'identification_type'    => 'nullable|string|max:20',
                'tax_no'                 => 'nullable|string|max:50',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            }

            $provider = $this->providerRepository->update($id, $validated);
            if (! $provider) {
                return response()->error("Proveedor no encontrado", 404);
            }

            return response()->success(compact('provider'), "Proveedor actualizado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->providerRepository->delete($id);
            if (! $deleted) {
                return response()->error("Proveedor no encontrado", 404);
            }

            return response()->success([], "Proveedor eliminado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
